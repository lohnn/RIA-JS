/**
 * Created by lohnn on 2014-11-23.
 */

var React = require('react');
var Firebase = require('firebase');

var myRootRef = new Firebase('https://myprojectname.firebaseIO-demo.com/');
myRootRef.set("hello world!");
var App = React.createElement("h1", null, "Hello, World!");

module.exports = App;