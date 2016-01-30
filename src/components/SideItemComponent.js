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
            <p className='light'>
             Course: {d}
             <br/>
             Modules #: { groupBy[d].length }
            </p>
          </li>
        );
      })
    }

    return (
      <div className="col s12">
        <div className='card side-item'>
          <div className='card-content'>
            <div className='card-title'>
              <strong className='bold-text'>Assignments Done: {date}</strong>
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
