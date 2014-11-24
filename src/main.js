/**
 * Created by lohnn on 2014-11-24.
 */

/** @jsx React.dom */

var App = require('./components/app'),
    Reqct = require('react');

Reqct.renderComponent(
    App,
    document.getElementById("main")
);