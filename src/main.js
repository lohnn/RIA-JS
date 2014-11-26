/**
 * Created by lohnn on 2014-11-24.
 */

/** @jsx React.dom */

var App = require('./components/app');
var React = require('react');
var $ = require("jquery");
var Firebase = require("firebase");

React.render(
    App({message: "Hola"}),
    document.getElementById("main")
);



var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
}

myDataRef.on('child_added', function (snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});
