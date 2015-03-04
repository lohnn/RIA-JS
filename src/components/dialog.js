/**
 * Created by lohnn on 2015-02-09.
 */

var React = require("react");

var Dialog = React.createClass({
    render: function () {
        return (
            <div className="dialog-fill-screen">
                <div className="dialog" style={this.props.style}>
                    <a className="dialog-close" onClick={this.props.onClose}>
                        X
                    </a>
                {this.props.children}
                </div>
            </div>);
    }
});

module.exports = Dialog;