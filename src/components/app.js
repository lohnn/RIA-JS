/**
 * Created by lohnn on 2014-11-23.
 */

var React = require('react');
var Firebase = require("firebase");
var _ = require('lodash');
var Receipt = require('./productRelated');
//var RenderReceipt = new require("./renderReceipt");
//var RenderProducts = new require("./renderProducts");

//==============================================================================


var RenderProducts = React.createClass({
    addProduct: function (product, pid) {
        return <div key={pid} className="product_part_product">
            <img alt={product.name} img={product.image} onClick={function () {
                this.props.functionToRun(product);
            }.bind(this)} />
        {product.name}
        </div>;
    },
    render: function () {
        return <div>{_.map(this.props.items, this.addProduct, this)}</div>;
    }
});

var RenderReceipt = React.createClass({
    addProduct: function (productLine, pid) {
        return <div key={pid} className="receipt_product">
            <div className="product_amount">{productLine.amount + "st"}</div>
            <div className="product_name">{productLine.getName()}</div>
            <div className="product_remove" onClick={function () {
                this.props.functionToRun(productLine.product);
            }.bind(this)}>X</div>
            <div className="product_price">{productLine.getTotalPrice() + "kr"}</div>
        </div>;
    },
    render: function () {
        return <div>
        {_.map(this.props.items, this.addProduct)}
        </div>;
    }
});

var App = React.createClass({
    displayName: "simple",

    mixin: [Receipt],

    getInitialState: function () {
        return {
            receiptProducts: {},
            products: {}
        };
    },
    componentWillMount: function () {
        this.firebaseProductsRef = new Firebase("https://lohnn-riajs.firebaseio.com/products");
        this.firebaseProductsRef.on("value", function (dataSnapshot) {
            this.setState({products: dataSnapshot.val()});
        }.bind(this));
        //TODO: If I had a receipt when I closed the app, that receipt should be reopened.

        this.receiptID = window.location.hash.substring(1);
        this.firebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/receipts/" + this.receiptID);

        if (this.receiptID)
            console.log("try to load receipt");
        else { //Create new receipt
            this.receiptID = this.firebaseReceiptRef.push().key();
            this.firebaseReceiptRef.off();
            this.firebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/receipts/" + this.receiptID);
        }

        this.firebaseReceiptRef.on("value", function (dataSnapshot) {
            if (dataSnapshot.val() !== null)
                this.setReceipt(dataSnapshot.val());
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseProductsRef.off();
        this.firebaseReceiptRef.off();
    },

    setReceipt: function (products) {
        Receipt.setProducts(products);
        this.setState({receiptProducts: this.state.receiptProducts});
    },

    addToReceipt: function (product) {
        Receipt.addProduct(product);
        this.firebaseReceiptRef.set(this.state.receiptProducts);

        if (!window.location.hash.substring(1)) {
            history.pushState(null, null, '#' + this.receiptID);
        }
    },

    removeLineFromReceipt: function (product) {
        Receipt.removeProduct(product);
        this.firebaseReceiptRef.set(this.state.receiptProducts);
    },

    cancelAction: function (e) {
        Receipt.clearProducts();
        this.firebaseReceiptRef.set(this.state.receiptProducts);
        e.preventDefault();
    },

    render: function () {
        return <div id="main" className="container">
            <div className="purchase_part">
                <div className="receipt">
            {RenderReceipt({items: this.state.receiptProducts, functionToRun: this.removeLineFromReceipt})}
                </div>
                <div className="summary">
                    <div className="sum_amount">{Receipt.getTotalProducts()+"st"}</div>
                    <div className="sum_price">{"kr"}</div>
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
