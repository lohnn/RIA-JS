/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');
var Firebase = require("firebase");
var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

var RenderReceipt = React.createClass({
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
var RenderProducts = React.createClass({
    render: function () {
        return React.DOM.div(null, this.props.items.map(function (product) {
            return React.DOM.div({className: "product_part_product"},
                React.DOM.img({alt: product.name}),
                product.name
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

var Receipt = function () {
    if (!(this instanceof Receipt))
        return new Receipt();

    this.productLines = [];
    this.addProduct = function (product, amount) {
        amount = typeof amount !== 'undefined' ? amount : 1;
        this.productLines.push(Product_line(product));
    };

    this.getTotalProducts = function () {
        var temp = 0;
        this.productLines.forEach(function (element) {
            temp += element.amount;
        });
        return temp;
    };

    this.getTotalPrice = function () {
        var temp = 0;
        this.productLines.forEach(function (element) {
            temp += element.getTotalPrice();
        });
        return temp;
    };
};

var receipt = Receipt();
var productsInList = [Product("Pizza", 80), Product("Pizzasallad", 10)];
receipt.addProduct(productsInList[0]);
receipt.addProduct(productsInList[1]);


var App = React.createClass({
    displayName: "simple",

    getInitialState: function () {
        this.receipt = receipt;
        this.products = productsInList;
        return {
            messages: []
        };
    },

    /*componentWillMount: function () {
     this.firebaseRef = new Firebase("https://lohnn-riajs.firebaseio.com/");
     this.firebaseRef.on("child_added", function (dataSnapshot) {
     this.messages.push(dataSnapshot.val());
     this.setState({messages: this.messages});
     }.bind(this));
     },
     componentWillUnmount: function () {
     this.firebaseRef.off();
     },*/

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
                    RenderReceipt({items: this.receipt.productLines})
                ),
                React.DOM.div({className: "summary"},
                    React.DOM.div({className: "sum_amount"}, this.receipt.getTotalProducts() + "st"),
                    React.DOM.div({className: "sum_price"}, this.receipt.getTotalPrice() + "kr")
                ),
                React.DOM.div({className: "purchase_buttons"},
                    React.DOM.div({className: "fill_width float_left"},
                        React.DOM.div({className: "purchase_buttons_discount"}, "Rabatt"),
                        React.DOM.div({className: "purchase_buttons_finished"}, "Klar")
                    ),
                    React.DOM.div({className: "purchase_buttons_cancel float_left"}, "Avbryt")
                )
            ), React.DOM.div({className: "product_part"},
                RenderProducts({items: this.products})
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