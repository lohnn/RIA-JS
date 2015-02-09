/**
 * Created by lohnn on 2015-02-09.
 */

var React = require("react");

var DialogControl = React.createClass({
    getDefaultProps: function () {
        return {
            visible: false
            };
    },

    handleTrigger: function(){
        this.setProps({visible: true});
    },

    render: function () {
        var dialog;
        if (this.props.visible === true) {
            dialog = <div className="dialog" style={this.props.style}>
                <p>HEJSAN</p>
                <p>Hej igen</p>
                <div>
                    <button onClick={this.handleClose}>close</button>
                    <button onClick={this.handleSave}>Save changes</button>
                </div>
            </div>;
        }

        return (
            <div>
                <button className="button" onClick={this.handleTrigger}>show dialog</button>
            {dialog}
            </div>);
    }
});


//<Dialog title="HEJSAN" visible={this.state.showDialog}
//    onClose={this.handleClose}
//    onShow={this.onShow}
//    style={{width: 600}}>
//    <input/>
//    <p>HEJSAN</p>
//    <p>Hej igen</p>
//    <div>
//        <button onClick={this.handleClose}>close</button>
//        <button onClick={this.handleSave}>Save changes</button>
//    </div>
//</Dialog>

module.exports = DialogControl;