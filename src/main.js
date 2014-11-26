/**
 * Created by lohnn on 2014-11-24.
 */

/** @jsx React.dom */

var App = require('./components/app');
var React = require('react');

React.render(
    App({message: "Hola"}),
    document.getElementById("main")
);