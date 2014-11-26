/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');

var App = React.createClass({
    displayName: "simple",

    getInitialState: function () {
        return {count: 0};
    },

    handleMouseDown: function () {
        //alert('I was told: ' + this.props.message);
        this.setState({count: this.state.count + 1});
    },

    render: function () {
        return React.DOM.div(null,
            React.DOM.div({className: "clicker", onMouseDown: this.handleMouseDown},
                " Give me the message! "),
            React.DOM.div({className: "message"}, "Message conveyed ",
                React.DOM.span({className: "count"}, this.state.count), " time(s)")
        );
    }
});

module.exports = App;