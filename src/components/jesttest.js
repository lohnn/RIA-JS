/**
 * Created by lohnn on 2014-11-28.
 */

/** @jsx React.DOM */
var React = require('react/addons');
var CheckboxWithLabel = React.createClass({
        getInitialState: function() {
            return { isChecked: false };
        },
        onChange: function() {
            this.setState({isChecked: !this.state.isChecked});
        },
        render: function() {
            return (this.state.isChecked ? this.props.labelOn : this.props.labelOff);
}
});
module.exports = CheckboxWithLabel;