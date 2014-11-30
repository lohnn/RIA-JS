/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');
var Firebase = require("firebase");
var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

/*var Message = React.createClass({
 render: function () {
 return React.DOM.div(null, this.props.items.map(function (item) {
 return React.DOM.div(null,
 React.DOM.em(null, item.name + ": "),
 item.text);
 }));
 }
 });*/

var Receipt = React.createClass({
    render: function () {
        return React.DOM.div(null, this.props.items.map(function (productLine) {
            return React.DOM.div({className: "receipt_product"},
                React.DOM.div({className: "product_amount"}, productLine.amount),
                React.DOM.div({className: "product_name"}, productLine.getName()),
                React.DOM.div({className: "product_price"}, productLine.getTotalPrice())
            );
        }));
    }
});

var Product = function (name, price) {
    if (!(this instanceof Product))
        return new Product(name, price);
    this.name = name;
    this.price = price;
};

var Product_line = function (product) {
    if (!(this instanceof Product_line))
        return new Product_line(product);

    this.product = product;
    this.amount = 1;

    this.getName = function () {
        return this.product.name;
    };

    this.getTotalPrice = function () {
        return this.product.price * this.amount;
    };
};

var product_line_temp = [
    Product_line(Product("Pizza", 75)),
    Product_line(Product("Pizzasallad", 10))
];

var App = React.createClass({
    displayName: "simple",

    getInitialState: function () {
        this.messages = [];
        return {
            count: 0,
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

    sendMessage: function (e) {
        if (e.which === 13) {
            var name = this.refs.name.getDOMNode().value;
            var text = this.refs.message.getDOMNode().value;
            myDataRef.push({name: name, text: text});
            this.refs.message.getDOMNode().value = "";
        }
    },

    render: function () {
        return React.DOM.div({id: "main", className: "container"},
            React.DOM.div({className: "purchase_part"},
                React.DOM.div({className: "receipt"},
                    Receipt({items: product_line_temp})
                ),
                React.DOM.div({className: "summary"},
                    React.DOM.div({className: "sum_amount"}, "2st"),
                    React.DOM.div({className: "sum_price"}, "85kr")
                ),
                React.DOM.div({className: "purchase_buttons"},
                    React.DOM.div({className: "fill_width float_left"},
                        React.DOM.div({className: "purchase_buttons_discount"}, "Rabatt"),
                        React.DOM.div({className: "purchase_buttons_finished"}, "Klar")
                    ),
                    React.DOM.div({className: "purchase_buttons_cancel float_left"}, "Avbryt")
                )
            ), React.DOM.div({className: "product_part"},
                React.DOM.div({className: "product_part_product"}, React.DOM.img({alt: "Mat"}), "Mat"),
                React.DOM.div({className: "product_part_product"}, React.DOM.img({alt: "Tillbehör"}), "Tillbehör"),
                React.DOM.div({className: "product_part_product"}, React.DOM.img({alt: "Mat"}), "Mat")
            )
        );
    }
});

/*var App = React.createClass({
 displayName: "simple",

 getInitialState: function () {
 this.messages = [];
 return {
 count: 0,
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

 sendMessage: function (e) {
 if (e.which === 13) {
 var name = this.refs.name.getDOMNode().value;
 var text = this.refs.message.getDOMNode().value;
 myDataRef.push({name: name, text: text});
 this.refs.message.getDOMNode().value = "";
 }
 },

 render: function () {
 return React.DOM.div(null,
 React.DOM.div({id: "messagesDiv"}, Message({items: this.state.messages})),
 React.DOM.input({
 id: "nameInput", ref: "name", type: "text", placeholder: "Name",
 onChange: this.handleNameChange
 }),
 React.DOM.input({
 id: "messageInput", ref: "message", type: "text", placeholder: "Message",
 onKeyPress: this.sendMessage, onChange: this.handleMessageChange
 }),
 React.DOM.div({className: "clicker", onMouseDown: this.handleMouseDown},
 " Give me the message! "),
 React.DOM.div({className: "message"}, "Message conveyed ",
 React.DOM.span({className: "count"}, this.state.count), " time(s)")
 );
 }
 });*/

module.exports = App;