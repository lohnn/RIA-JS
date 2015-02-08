/**
 * Created by lohnn on 2014-11-23.
 */

var React = require('react');
var Firebase = require("firebase");
var Receipt = require('./productRelated');
var RenderReceipt = require("./renderReceipt");
var RenderProducts = require("./renderProducts");

//==============================================================================

var App = React.createClass({
    mixins: [Receipt],

    displayName: "simple",

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

        //TODO: If I had a receipt when I closed the app, that receipt should be reopened. (save for next time)

        this.firebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/receipts/");

        this.receiptID = window.location.hash.substring(1);
        if (!this.receiptID) { //Create new receipt
            this.receiptID = this.firebaseReceiptRef.push().key();
        }

        this.firebaseReceiptRef.child(this.receiptID).on("value", function (dataSnapshot) {
            this.setReceipt(dataSnapshot.val());
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseProductsRef.off();
        this.firebaseReceiptRef.off();
    },

    setReceipt: function (products) {
        this.setProducts(products);
        this.setState({receiptProducts: this.state.receiptProducts});
    },

    addToReceipt: function (product) {
        this.addProduct(product);
        this.updateFirebase();

        if (!window.location.hash.substring(1)) {
            history.pushState(null, null, '#' + this.receiptID);
        }
    },

    updateFirebase: function () {
        this.firebaseReceiptRef.child(this.receiptID).set(JSON.parse(JSON.stringify(this.state.receiptProducts)));
    },

    removeLineFromReceipt: function (product) {
        this.removeProduct(product);
        this.updateFirebase();
    },

    cancelAction: function () {
        this.clearProducts();
        this.updateFirebase();
    },

    finishedAction: function () {
        var finishedFirebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/finished-receipts/");
        finishedFirebaseReceiptRef.child(this.receiptID).set(JSON.parse(JSON.stringify(this.state.receiptProducts)));
        finishedFirebaseReceiptRef.off();

        this.firebaseReceiptRef.child(this.receiptID).remove();
        this.firebaseReceiptRef.off();
        history.pushState(null, null, '#');
        this.receiptID = this.firebaseReceiptRef.push().key();
        this.firebaseReceiptRef.child(this.receiptID).on("value", function (dataSnapshot) {
            this.setReceipt(dataSnapshot.val());
        }.bind(this));
        this.cancelAction();
    },

    render: function () {
        return <div id="main" className="container">
            <div className="purchase_part">
                <div className="receipt">
            {RenderReceipt({items: this.state.receiptProducts, functionToRun: this.removeLineFromReceipt})}
                </div>
                <div className="summary">
                    <div className="sum_amount">{this.getTotalProducts() + "st"}</div>
                    <div className="sum_price">{this.getTotalProducts() + "kr"}</div>
                </div>
                <div className="purchase_buttons">
                    <div className="fill_width float_left">
                        <div className="purchase_buttons_discount">Rabatt</div>
                        <div className="purchase_buttons_finished" onClick={this.finishedAction}>Klar</div>
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
