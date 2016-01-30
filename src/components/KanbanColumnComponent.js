'use strict';

import React from 'react';
import KanbanItemComponent from './KanbanItemComponent';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';

require('styles//KanbanColumn.sass');

class KanbanColumnComponent extends React.Component {
  componentWillMount() {
    this.setValues(this.props);
  }
  componentWillReceiveProps(props) {
    this.setValues(props);
  }
  setValues(props) {
    let {
      data
    } = props;

    let column = _.map(data, (d,i) => {
      return { course: i, count: d.length, modules: d}
    });
    this.setState({column: column});
  }
  render() {
    let { addNewWorkDone } = this.props;
    let { column } = this.state;
    let items;
    if(column.length) {
      items = column.map((d) => {
        return <KanbanItemComponent  addNewWorkDone={addNewWorkDone} {...d} key={`${d.course}-${d.count}`}/>;
      });
    }
    return (
      <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={100} transitionLeaveTimeout={300}>
        <div className="kanbancolumn-component">
          { items }
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

KanbanColumnComponent.displayName = 'KanbanColumnComponent';

// Uncomment properties you need
// KanbanColumnComponent.propTypes = {};
// KanbanColumnComponent.defaultProps = {};

export default KanbanColumnComponent;
