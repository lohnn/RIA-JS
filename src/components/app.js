/**
 * Created by lohnn on 2014-11-23.
 */

var React = require('react');
var Firebase = require("firebase");
var Receipt = require('./productRelated');
var RenderReceipt = require("./renderReceipt");
var RenderProducts = require("./renderProducts");
var Dialog = require('./dialog');
var _ = require("lodash");

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
        console.log(this.state.receiptProducts);
        this.firebaseReceiptRef.child(this.receiptID).set(JSON.parse(JSON.stringify(this.state.receiptProducts)));
    },

    removeLineFromReceipt: function (product) {
        this.removeProduct(product);
        this.updateFirebase();
    },

    updateLineAmount: function (productLine) {
        var amount = productLine.amount;

        var confirmAction = function () {
            if (amount <= 0) {
                this.removeLineFromReceipt(productLine.product);
            } else {
                productLine.amount = amount;
                this.updateFirebase();
            }
            this.removeDialog();
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 300, height: 200}}>
                <p>Ange hur många produkter det ska vara</p>
                <input type="number" min="0" onChange={function (event) {
                    amount = event.target.value;
                    console.log(amount);
                }} defaultValue={productLine.amount} />
                <div className="dialog-footer">
                    <button onClick={this.removeDialog} className="dialog-button-cancel">Avbryt</button>
                    <button onClick={confirmAction} className="dialog-button-confirm">Klar</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    cancelAction: function () {
        this.clearProducts();
        this.updateFirebase();
    },

    dialogDiv: function () {
        return document.getElementById("dialog-div");
    },

    removeDialog: function () {
        React.unmountComponentAtNode(this.dialogDiv());
    },

    cancelDialog: function () {
        //If receipt is empty, do nothing
        if (this.getTotalProducts() <= 0) {
            return;
        }
        var cancelReceipt = function () {
            this.cancelAction();
            this.removeDialog();
        }.bind(this);

        var putOnShelf = function () {
            var finishedFirebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/shelved-receipts/");
            finishedFirebaseReceiptRef.child(this.receiptID).set(
                {
                    receiptInfo: {
                        time: Firebase.ServerValue.TIMESTAMP
                    },
                    products: JSON.parse(JSON.stringify(this.state.receiptProducts))
                });
            finishedFirebaseReceiptRef.off();

            this.firebaseReceiptRef.child(this.receiptID).remove();
            this.firebaseReceiptRef.off();
            history.pushState(null, null, '#');
            this.receiptID = this.firebaseReceiptRef.push().key();
            this.firebaseReceiptRef.child(this.receiptID).on("value", function (dataSnapshot) {
                this.setReceipt(dataSnapshot.val());
            }.bind(this));
            this.cancelAction();
            this.removeDialog();
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 320, height: 200}}>
                <p>Vill du avbryta eller lägga kvittot på hyllan för framtida ändringar?</p>
                <div className="dialog-footer">
                    <button className="dialog-button-cancel" onClick={cancelReceipt}>Avbryt kvitto</button>
                    <button onClick={putOnShelf}>Lägg på hyllan</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    listOldReceipts: function () {
        var finishedFirebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/finished-receipts/");
        finishedFirebaseReceiptRef.once('value', function (dataSnapshot) {
            React.render(
                (<Dialog onClose={this.removeDialog} style={{width: 400, height: 300}}>
                    <p>Din kvittohylla:</p>
                    <div className="dialog-receipt-list">
                    {_.map(dataSnapshot.val(), function (receipt, rid) {
                        var totalPrice = 0;
                        var totalAmount = 0;
                        _.map(receipt, function (productLine) {
                            totalAmount += productLine.amount;
                            totalPrice += productLine.amount * productLine.product.price;
                        });
                        return <div key={rid} className="receipt_product">
                            {totalAmount}st | {totalPrice}kr
                        </div>;
                    })}
                    </div>

                    <div className="dialog-footer">
                        <button className="dialog-button-cancel" onClick={this.removeDialog}>Avbryt</button>
                    </div>
                </Dialog>),
                this.dialogDiv()
            );
        }.bind(this));
    },

    finishedAction: function () {
        var receiptDone = function () {
            var finishedFirebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/finished-receipts/");
            finishedFirebaseReceiptRef.child(this.receiptID).set(
                {
                    receiptInfo: {
                        time: Firebase.ServerValue.TIMESTAMP
                    },
                    products: JSON.parse(JSON.stringify(this.state.receiptProducts))
                });
            finishedFirebaseReceiptRef.off();

            this.firebaseReceiptRef.child(this.receiptID).remove();
            this.firebaseReceiptRef.off();
            history.pushState(null, null, '#');
            this.receiptID = this.firebaseReceiptRef.push().key();
            this.firebaseReceiptRef.child(this.receiptID).on("value", function (dataSnapshot) {
                this.setReceipt(dataSnapshot.val());
            }.bind(this));
            this.cancelAction();

            this.removeDialog();
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 300, height: 200}}>
                <p>Är du säker på att du är klar med beställningen?</p>
                <div className="dialog-footer">
                    <button className="dialog-button-cancel" onClick={this.removeDialog}>Fortsätt beställning</button>
                    <button className="dialog-button-confirm" onClick={receiptDone}>Klar</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    render: function () {
        var finishedOrList = (this.getTotalProducts() <= 0) ?
            <div className="purchase_buttons_finished" onClick={this.listOldReceipts}>Gamla kvitton</div> :
            <div className="purchase_buttons_finished" onClick={this.finishedAction}>Klar</div>;
        return <div id="main" className="container">
            <div id="dialog-div" />
            <div className="purchase_part">
                <div className="receipt">
                    {RenderReceipt({
                        items: this.state.receiptProducts,
                        functionToRun: this.removeLineFromReceipt,
                        updateLineAmountFunction: this.updateLineAmount
                    })}
                </div>
                <div className="summary">
                    <div className="sum_amount">{this.getTotalProducts() + "st"}</div>
                    <div className="sum_price">{this.getTotalProducts() + "kr"}</div>
                </div>
                <div className="purchase_buttons">
                    <div className="fill_width float_left">
                        <div className="purchase_buttons_discount">Rabatt</div>
                        {finishedOrList}
                    </div>
                    <a href="#" className="purchase_buttons_cancel float_left" onClick={this.cancelDialog}>Avbryt</a>
                </div>
            </div>
            <div className="product_part">
                {RenderProducts({items: this.state.products, functionToRun: this.addToReceipt})}
            </div>
        </div>;
    }
});

module.exports = App;
