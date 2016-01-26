'use strict';

import React from 'react';
import _ from 'lodash';

require('styles//SideItem.scss');

class SideItemComponent extends React.Component {
  render() {
    let { data } = this.props;
    let list, date;

    if(data) {
      let groupBy = _.groupBy(data.modules, 'course');
      let modules = _.keys(groupBy)
      date = data.date.toLocaleDateString()
      list = modules.map((d) => {
        return (
          <li key={d}>
            <p> Course: {d} </p>
            <p> Number of Modules Done: { groupBy[d].length } </p>
          </li>
        );
      })
    }

    return (
      <div className="col s122">
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

SideItemComponent.displayName = 'SideItemComponent';

// Uncomment properties you need
// SideItemComponent.propTypes = {};
// SideItemComponent.defaultProps = {};

export default SideItemComponent;
