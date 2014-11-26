/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');
var Firebase = require("firebase");
var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

var Message = React.createClass({
    render: function () {
        return React.DOM.div(null, this.props.items.map(function (item) {
            return React.DOM.div(null,
                React.DOM.em(null, item.name + ": "),
                item.text);
        }));
    }
});
var App = React.createClass({
    displayName: "simple",

    getInitialState: function () {
        this.messages = [];
        return {
            count: 0,
            nameInput: "",
            messages: []
        };
    },

    componentWillMount: function () {
        this.firebaseRef = new Firebase("https://lohnn-riajs.firebaseio.com/");
        this.firebaseRef.on("child_added", function (dataSnapshot) {
            this.messages.push(dataSnapshot.val());
            this.setState({messages: this.messages});
        }.bind(this));
    },

    componentWillUnmount: function () {
        this.firebaseRef.off();
    },

    handleMouseDown: function () {
        this.setState({count: this.state.count + 1});
    },

    handleNameChange: function (e) {
        this.setState({nameInput: e.target.value});
    },

    handleMessageChange: function (e) {
        this.setState({messageInput: e.target.value});
    },

    sendMessage: function (e) {
        if (e.which === 13) {
            var name = this.state.nameInput;
            var text = this.state.messageInput;
            myDataRef.push({name: name, text: text});
            this.setState({messageInput: ""});
        }
    },

    render: function () {
        return React.DOM.div(null,
            React.DOM.div({id: "messagesDiv"}, Message({items: this.state.messages})),
            React.DOM.input({
                id: "nameInput", type: "text", placeholder: "Name",
                onChange: this.handleNameChange, value: this.state.nameInput
            }),
            React.DOM.input({
                id: "messageInput", type: "text", placeholder: "Message",
                onKeyPress: this.sendMessage, value: this.state.messageInput, onChange: this.handleMessageChange
            }),
            React.DOM.div({className: "clicker", onMouseDown: this.handleMouseDown},
                " Give me the message! "),
            React.DOM.div({className: "message"}, "Message conveyed ",
                React.DOM.span({className: "count"}, this.state.count), " time(s)")
        );
    }
});

module.exports = App;