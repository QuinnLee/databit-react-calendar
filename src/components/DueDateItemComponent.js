'use strict';

import React from 'react';
import _ from 'lodash';

require('styles//DueDateItem.scss');

class DueDateItemComponent extends React.Component {
  render() {
    let { data } = this.props;
    let list, date;

    if(data) {
      let groupBy = _.groupBy(data.modules, 'course');
      let modules = _.keys(groupBy)
      date = data.date.toLocaleDateString();
      list = modules.map((d) => {
        return (
          <li key={d}>
            <p> Course: {d} </p>
            <p> Number of Modules Due: <bold>{ groupBy[d].length }</bold> </p>
          </li>
        );
      });
    }

    return (
      <div className="col s12 duedateitem-component">
        <div className='card side-item'>
          <div className='card-content'>
            <div className='card-title'>
              <p>Assigments Finished: {date}</p>
            </div>
            <ul>
              {list}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

DueDateItemComponent.displayName = 'DueDateItemComponent';

// Uncomment properties you need
// DueDateItemComponent.propTypes = {};
// DueDateItemComponent.defaultProps = {};

export default DueDateItemComponent;
