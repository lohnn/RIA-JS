/**
 * Created by lohnn on 2014-11-23.
 */

/** @jsx React.dom */

var React = require('react');
var Firebase = require("firebase");
var _ = require('lodash');
var Receipt = require('./productRelated');
//var myDataRef = new Firebase('https://lohnn-riajs.firebaseio.com/');

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
        this.receipt.clearProducts();
        this.setState({receiptProducts: []});
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
                        <div className="purchase_buttons_finished">Klar</div>
                    </div>
                    <a href="#" className="purchase_buttons_cancel float_left" onClick={this.cancelAction}>Avbryt</a>
                </div>
            </div>
            <div className="product_part">
            {RenderProducts({items: this.state.products, functionToRun: this.addToReceipt})}
            </div>
        </div>;
    }
});

module.exports = App;
