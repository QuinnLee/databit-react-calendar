'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import * as Util from '../util/findClosest';

require('styles//CalendarChart.scss');

class CalendarChartComponent extends React.Component {
  constructor() {
    super();
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  componentWillMount() {
    this.setValues(this.props);
  }
  componentWillReceiveProps(props) {
    this.setValues(props);
  }
  componentDidMount() {
    const { height, bottomMargin, setHighlightDate, setHighlightWorkDate } = this.props;
    let { data, studentData } = this;

    const dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(10,' + (height - bottomMargin) + ')')
      .call(this.xAxis);

    const handleMouseMove = this.handleMouseMove;

    svg.on('mousemove', function() {
      let dueDate = handleMouseMove(d3.mouse(this), data);
      let studentDate = handleMouseMove(d3.mouse(this), studentData);
      setHighlightDate(dueDate);
      setHighlightWorkDate(studentDate);
    }).on('mouseleave', () => {
      setHighlightDate(null);
      setHighlightWorkDate(null);
    });
  }
  componentDidUpdate() {
    const { setHighlightDate, setHighlightWorkDate } = this.props;
    let { data, studentData } = this;

    const dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');

    const handleMouseMove = this.handleMouseMove;

    svg.on('mousemove', function() {
      let dueDate = handleMouseMove(d3.mouse(this), data);
      let studentDate = handleMouseMove(d3.mouse(this), studentData);
      setHighlightDate(dueDate);
      setHighlightWorkDate(studentDate);
    }).on('mouseleave', () => {
      setHighlightDate(null);
      setHighlightWorkDate(null);
    });
  }
  handleMouseMove([mouseX, mouseY], data) {
    const xKey = 'date';
    const { xScale, yScale } = this;

    let domainX = xScale.invert(mouseX);
    let domainY = yScale.invert(mouseY);

    if (domainX < xScale.domain()[0] || domainX > xScale.domain()[1]) {
      domainX = null;
    }
    if (domainY < yScale.domain()[0] || domainY > yScale.domain()[1]) {
      domainY = null;
    }
    return Util.findClosest(data, domainX, (d) => d[xKey]);
  }
  setValues(props) {
    let {
      calendarData,
      studentData,
      newDone,
      height,
      width,
      topMargin,
      bottomMargin,
      leftMargin,
      rightMargin
    } = props;

    this.yMin = 0;
    this.yMax = calendarData.length;

    let yValue = this.yMax;
    let firstDatum = { yVal: yValue, date: new Date('2015-09-09') };
    let timeFormat =  d3.time.format('%m/%e');

    this.data = _.chain(calendarData)
      .groupBy('due_date')
      .map((values, key) => { return { date: new Date(key), modules: values }; })
      .sortBy('date')
      .each((d) => { yValue = yValue - d.modules.length; d.yVal = yValue })
      .value();

    this.data.unshift(firstDatum);

    yValue = this.yMax;
    this.studentData = _.chain(studentData)
      .groupBy('completiondate')
      .map((values, key) => { return { date: new Date(key), modules: values }; })
      .sortBy('date')
      .each((d) => { yValue = yValue - d.modules.length; d.yVal = yValue; })
      .value();

    yValue = _.get(_.last(this.studentData), 'yVal');
    this.newLine = _.chain(newDone)
      .sortBy('date')
      .each((d) => {
        yValue = yValue - d.count;  d.yVal = yValue;
      })
      .value();

    this.newLine.unshift(_.last(this.studentData));

    this.xScale = d3.time.scale()
      .domain([new Date('2015-09-01'), new Date('2015-12-10')])
      .range([0, width - rightMargin - leftMargin]);

    this.yScale = d3.scale.linear()
      .domain([1200, 0])
      .range([0, height - topMargin - bottomMargin]);

    this.line = d3.svg.line()
      .interpolate('step-after')
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.yVal));

    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .ticks(d3.time.day, 5)
      .tickValues(_.map(this.data, 'date'))
      .tickFormat(timeFormat)
      .orient('bottom');
  }
  render() {
    let { highlightedDate, workDate, width, height } = this.props;
    let { newLine, data, studentData, line, xScale, yScale } = this;

    let highlight;
    let xLine;

    if(highlightedDate) {
      highlight = <circle className='burn-node' r='4.5' cx={xScale(highlightedDate.date)} cy={yScale(highlightedDate.yVal)} />;
    }

    if(workDate) {
      let transform = `translate(${xScale(workDate.date)}, ${yScale(workDate.yVal)} )`;
      xLine= <line className='date-line' opacity={1} y1={0} y2={height} transform={transform} />
    }

    let circles =  data.map((d, i) => {
      /*
       *console.log(d.date.toLocaleString() == new Date('Wed Oct 14 2015 20:00:00 GMT-0400 (EDT)').toLocaleString());
       */
      return <circle className='burn-node' key={i} r='2.5' cx={xScale(d.date)} cy={yScale(d.yVal)} />
    });


    return (
      <div className="calendarchart-component col s12">
        <div className='card'>
          <div className='card-content'>
            <div className="col s12">
              <p>
                Hover over the the graph to see what is due next and what you have done
              </p>
            </div>
            <svg ref='svg' width={width} height={height} className='chart line-chart'>
              {highlight}
              {circles}
              {xLine}
              <path d={line(newLine)} className='new-line' />
              <path d={line(data)} className='burn-line' />
              <path d={line(studentData)} className='student-line' />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

CalendarChartComponent.displayName = 'CalendarChartComponent';

// Uncomment properties you need

CalendarChartComponent.propTypes = {
  calendarData:  React.PropTypes.array.isRequired,
  studentData:  React.PropTypes.array.isRequired,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  topMargin: React.PropTypes.number,
  bottomMargin: React.PropTypes.number,
  leftMargin: React.PropTypes.number,
  rightMargin: React.PropTypes.number
};

CalendarChartComponent.defaultProps = {
  topMargin: 25,
  bottomMargin: 25,
  leftMargin: 15,
  rightMargin: 15
};

export default CalendarChartComponent;
