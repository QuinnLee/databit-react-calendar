'use strict';

import React from 'react';
import classNames from 'classNames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
require('styles//KanbanItem.sass');

class KanbanItemComponent extends React.Component {
  constructor() {
    super();
    this.state = { done: false };
  }
  foo(data) {
    this.setState({done: !this.state.done})
    this.props.addNewWorkDone(data, this.state.done);
  }
  render() {
    let { course, count } = this.props;
    let classes = classNames('card', 'col', 's6', 'kanbanitem-component',{
      'indigo darken-1': this.state.done,
    });
    return (
      <ul className={classes} onClick={this.foo.bind(this, this.props)}>
        <div className='card-content'>
          <p>{course}</p>
        </div>
      </ul>
    );
  }
}

KanbanItemComponent.displayName = 'KanbanItemComponent';

// Uncomment properties you need
// KanbanItemComponent.propTypes = {};
// KanbanItemComponent.defaultProps = {};

export default KanbanItemComponent;
