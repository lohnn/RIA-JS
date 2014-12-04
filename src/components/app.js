/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');
var Firebase = require("firebase");
var _ = require('lodash');
//var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

var Product = function (productParams) {
    if (!(this instanceof Product))
        return new Product(productParams);
    this.name = productParams.name;
    this.price = productParams.price;
    this.image = typeof productParams.image !== 'undefined' ? productParams.image : "";
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
        var doesExist = false;
        amount = typeof amount !== 'undefined' ? amount : 1;

        this.productLines.every(function (element) {
            if (element.product === product) {
                element.amount += amount;
                doesExist = true;
                return false;
            }
            return true;
        });
        if (doesExist === false) {
            var productLineToAdd = Product_line(product);
            this.productLines.push(productLineToAdd);
        }
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
//==============================================================================

var RenderReceipt = React.createClass({
    addProduct: function (productLine, pid) {
        return <div key={pid} className="receipt_product">
            <div className="product_amount">{productLine.amount}</div>
            <div className="product_name">{productLine.getName()}</div>
            <div className="product_price">{productLine.getTotalPrice()}</div>
        </div>;
    },
    render: function () {
        return <div>
        {_.map(this.props.items, this.addProduct)}
        </div>;
    }
});
var RenderProducts = React.createClass({
    addProduct: function (product, pid) {
        var functionToRun = this.props.functionToRun;
        return <div key={pid} className="product_part_product">
            <img alt={product.name} img={product.image} onClick={function () {
                functionToRun(product);
            }} />
        {product.name}
        </div>;
    },
    render: function () {
        return <div>{_.map(this.props.items, this.addProduct, this)}</div>;
    }
});

var App = React.createClass({
    displayName: "simple",

    getInitialState: function () {
        this.receipt = receipt;
        return {
            receiptProducts: [],
            products: {}
        };
    },
    componentWillMount: function () {
        this.firebaseProductsRef = new Firebase("https://lohnn-riajs.firebaseio.com/products");
        this.firebaseProductsRef.on("value", function (dataSnapshot) {
            this.setState({products: dataSnapshot.val()});
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseProductsRef.off();
    },

    addToReceipt: function (product) {
        this.receipt.addProduct(product);
        this.setState({receiptProducts: this.receipt.productLines});
    },

    cancelAction: function () {
        console.log("Avbryt köp!");
    },

    render: function () {
        return <div id="main" className="container">
            <div className="purchase_part">
                <div className="receipt">
            {RenderReceipt({items: this.state.receiptProducts})}
                </div>
                <div className="summary">
                    <div className="sum_amount">{this.receipt.getTotalProducts() + "st"}</div>
                    <div className="sum_price">{this.receipt.getTotalPrice() + "kr"}</div>
                </div>
                <div className="purchase_buttons">
                    <div className="fill_width float_left">
                        <div className="purchase_buttons_discount">Rabatt</div>
                        <div className="purchase_buttons_finished" onClick={this.cancelAction}>Klar</div>
                    </div>
                    <div className="purchase_buttons_cancel float_left">Avbryt</div>
                </div>
            </div>
            <div className="product_part">
            {RenderProducts({items: this.state.products, functionToRun: this.addToReceipt})}
            </div>
        </div>;
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
 this.firebaseProductsRef = new Firebase("https://lohnn-riajs.firebaseio.com/");
 this.firebaseProductsRef.on("child_added", function (dataSnapshot) {
 this.messages.push(dataSnapshot.val());
 this.setState({messages: this.messages});
 }.bind(this));
 },
 componentWillUnmount: function () {
 this.firebaseProductsRef.off();
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