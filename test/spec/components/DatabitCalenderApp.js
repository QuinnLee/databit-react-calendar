'use strict';

describe('DatabitCalenderApp', function () {
  var React = require('react/addons');
  var DatabitCalenderApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    DatabitCalenderApp = require('components/DatabitCalenderApp.js');
    component = React.createElement(DatabitCalenderApp);
  });

  it('should create a new instance of DatabitCalenderApp', function () {
    expect(component).toBeDefined();
  });
});
