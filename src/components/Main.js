require('normalize.css');
require('styles/App.css');

import React from 'react';
import _ from 'lodash';

import CalendarChartComponent from './CalendarChartComponent';
import KanbanBoardComponent from './KanbanBoardComponent';
import SideItemComponent from './SideItemComponent';
import DueDateItemComponent from './DueDateItemComponent';
import CalendarData from '../data/data';
import Dictionary from '../data/dictionary';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.dictionary = _.keyBy(Dictionary, (d) => `${d.course_number}-${d.module_number}`);

    this.state = {
      studentData: [],
      students: [],
      calendarData: CalendarData,
      highlightedDate: null,
      workDate: null,
      newDone: [],
      loaded: false
    };

    this.updateId = this.updateId.bind(this);
    this.setHighlightDate = this.setHighlightDate.bind(this);
    this.setHighlightWorkDate= this.setHighlightWorkDate.bind(this);
    this.state.today = new Date('Oct 15, 2015');
    this.state.studentId = 1;

  }
  updateId(e) {
    let newId = +e.target.value;
    let studentData = _.filter(this.state.studentsData, {student_id: newId})
    this.setState({
      studentId: newId,
      studentData: studentData,
      highlightedDate: null,
      workDate: null,
      newDone: []
    });
  }
  componentDidMount() {
    $.ajax({
      url: 'https://s3.amazonaws.com/databits.io/databits/56a6b75ba3373a7d0e2e119b/student.json',
      dataType: 'json',
      success: (result) => {
        let studentsData = _.each(result, (d) => {
          d.course = _.get(this.dictionary, `${d.course_number}-${d.module_number}.course`);
          d.completiondate = new Date(d.completiondate).toLocaleDateString();
        });
        let students = _.uniq(_.map(studentsData, 'student_id'));
        let studentData = _.filter(studentsData, {student_id: 1})
        this.setState({loaded: true, students: students, studentsData: studentsData, studentData: studentData});
      }
    });
  }
  setHighlightDate(date) {
    this.setState({highlightedDate: date});
  }
  setHighlightWorkDate(date) {
    this.setState({workDate: date});
  }
  setHighlightDueDate(date) {
    this.setState({dueDate: date});
  }
  addNewWorkDone(data, isDone) {
    let { course, count } = data;
    let { today, newDone } = this.state;
    let point = {
      course: course,
      count: count,
      date: today
    }

    if(isDone) {
      newDone = _.reject(newDone, point);
    } else {
      newDone.push(point)
    }
    this.setState({newDone: newDone});
  }
  render() {
    let {
      calendarData,
      studentData,
      students,
      studentId,
      today,
      highlightedDate,
      workDate,
      loaded
    } = this.state;
    let chart;

    if(loaded) {
      chart = < CalendarChartComponent {...this.state}
        setHighlightDate={this.setHighlightDate}
        setHighlightWorkDate={this.setHighlightWorkDate}
        height={400}
        width={560}
      />;
    }

    if(loaded) {
      return (
        <div className="index container">
          <div className='row'>
            <div className='input-field col s2'>
              <select value={studentId} onChange={this.updateId}>
                { students.map((id) => <option key={id} value={id}>{id}</option>) }
              </select>
            </div>
            <div className='col s10'>
              <h1>
                Course Burn Down Chart
              </h1>
            </div>
          </div>
          <div className='row'>
            <div className='card'>
              <div className='card-content'>
                <span className="card-title">
                  Today is {today.toLocaleDateString()}
                </span>
                <p>
                  Track the total work remaining and project the likelihood of finishing the course.
                  This help you manage its progress and respond accordingly.
                  The dotted line is the rate work should be completed. The solid line is your progress.
                </p>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s8'>
              {chart}
              <KanbanBoardComponent addNewWorkDone={this.addNewWorkDone.bind(this)} studentData={studentData} calendarData={calendarData} today={today} height={400} width={600} />
            </div>
            <div className='col s4'>
              <SideItemComponent data={workDate}/>
              <DueDateItemComponent data={highlightedDate}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
      <div className="index container">
        <div className='row'>
          <h1> Loading ... </h1>
        </div>
      </div>
     );
    }
  }
}

AppComponent.defaultProps = {};

AppComponent.propTypes = {};

export default AppComponent;
