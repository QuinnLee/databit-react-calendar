'use strict';

import React from 'react';
import _ from 'lodash';

import KanbanColumnComponent from './KanbanColumnComponent';
require('styles//KanbanBoard.sass');

class KanbanBoardComponent extends React.Component {
  componentWillMount() {
    this.setValues(this.props);
  }
  componentWillReceiveProps(props) {
    this.setValues(props);
  }
  setValues(props) {
    let {
      calendarData,
      studentData,
      today
    } = props;

    let groupingFunction = (d) => `${d.course_number}-${d.module_number}-${d.lesson_number}`;

    let filteredWork = _.filter(calendarData, (d) => { return new Date(d.due_date) < today });

    let unfinished = _.chain(filteredWork)
     .differenceBy(studentData, groupingFunction)
     .groupBy((d) => `${d.course}: Module # ${d.module_number}`)
     .value();

    let finished = _.chain(studentData)
     .groupBy((d) => `${d.course}: Module # ${d.module_number}`)
     .value();

    this.setState({unfinished: unfinished, finished: finished});
  }
  render() {
    let finishedWork = _.isEmpty(this.state.unfinished);
    if(finishedWork) {
      return (
      <div className="kanbanboard-component col s12">
        <div className='card'>
          <div className='card-content'>
            <span className='card-title'> You are up to date!</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="kanbanboard-component col s12">
        <div className='card'>
          <div className='card-content'>
            <span className='card-title'> Click on the remaining assigments when you finish</span>
            <p>
              The burndown chart will update when you finish an assigment
            </p>
          </div>
        </div>
        <KanbanColumnComponent addNewWorkDone={this.props.addNewWorkDone} data={this.state.unfinished} type='unfinished'/>
      </div>
    );
  }
}

KanbanBoardComponent.displayName = 'KanbanBoardComponent';

// Uncomment properties you need
// KanbanBoardComponent.propTypes = {};
// KanbanBoardComponent.defaultProps = {};

export default KanbanBoardComponent;
