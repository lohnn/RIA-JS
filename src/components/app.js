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

var FormatTime = function (inTime) {
    var time = new Date(inTime);
    var dd = time.getDate();
    var mm = time.getMonth() + 1; //January is 0!
    var yyyy = time.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    time = yyyy + '-' + mm + '-' + dd;
    return time;
};

var App = React.createClass({
    mixins: [Receipt],

    displayName: "simple",

    getInitialState: function () {
        return {
            receipt: {products: {}},
            products: {}
        };
    },
    componentWillMount: function () {
        this.firebaseProductsRef = new Firebase("https://lohnn-riajs.firebaseio.com/products");
        this.firebaseProductsRef.on("value", function (dataSnapshot) {
            this.setState({products: dataSnapshot.val()});
        }.bind(this));

        //TODO: If I had a receipt when I closed the app, that receipt should be reopened. (save for next time, cookies?)

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

    setReceipt: function (receipt) {
        if (!receipt) {
            this.setProducts(null);
        } else {
            this.setProducts(receipt.products);
            if (!receipt.receiptInfo) {
                this.setInfo({time: Firebase.ServerValue.TIMESTAMP});
            }
        }
        this.setState({receipt: this.state.receipt});
    },

    addToReceipt: function (product) {
        if (this.getTotalProducts() <= 0) {
            this.setInfo({time: Firebase.ServerValue.TIMESTAMP});
        }
        this.addProduct(product);
        this.updateFirebase();

        if (!window.location.hash.substring(1)) {
            history.pushState(null, null, '#' + this.receiptID);
        }
    },

    updateFirebase: function () {
        this.firebaseReceiptRef.child(this.receiptID).set(JSON.parse(JSON.stringify(this.state.receipt)));
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
                    amount = +event.target.value;
                }} defaultValue={productLine.amount}/>

                <div className="dialog-footer">
                    <button onClick={this.removeDialog} className="dialog-button-cancel">Avbryt</button>
                    <button onClick={confirmAction} className="dialog-button-confirm">Klar</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    addDiscount: function () {
        var amount = 0;

        var confirmAction = function () {
            if (amount > 0) {
                this.addProduct({name: "Rabatt", price: -amount});
                //productLine.amount = amount;
                this.updateFirebase();
                this.removeDialog();
            }
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 300, height: 200}}>
                <p>Ange mängden rabatt du vill lägga till på kvittot:</p>
                <input type="number" min="0" onChange={function (event) {
                    amount = +event.target.value;
                }} defaultValue={amount}/>

                <div className="dialog-footer">
                    <button onClick={this.removeDialog} className="dialog-button-cancel">Avbryt</button>
                    <button onClick={confirmAction} className="dialog-button-confirm">Klar</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    setPercentDiscountDialog: function () {
        var amount = this.getPercentDiscount();

        var confirmAction = function () {
            this.setPercentDiscount(amount);
            this.updateFirebase();
            this.removeDialog();
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 300, height: 200}}>
                <p>Ange rabatten du vill ha i procent:</p>
                <input type="number" min="0" onChange={function (event) {
                    amount = +event.target.value;
                }} defaultValue={amount}/>

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
        this.setInfo(null);
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

    /**
     *
     * @param shelved Set to true if you want to see the shelf instead of the old receipts
     */
    listOldReceipts: function (shelved) {
        var finishedFirebaseReceiptRef = (shelved === true) ?
            new Firebase("https://lohnn-riajs.firebaseio.com/receipts/") :
            new Firebase("https://lohnn-riajs.firebaseio.com/finished-receipts/");
        finishedFirebaseReceiptRef.once('value', function (dataSnapshot) {
            React.render(
                (<Dialog onClose={this.removeDialog} style={{width: 400, height: 300}}>
                    <p>Din kvittohylla:</p>

                    <div className="dialog-receipt-list">
                        {_.map(dataSnapshot.val(), function (receipt, rid) {
                            var totalPrice = 0;
                            var totalAmount = 0;
                            _.map(receipt.products, function (productLine) {
                                totalAmount += productLine.amount;
                                totalPrice += productLine.amount * productLine.product.price;
                            });

                            var loadOldReceipt = function () {
                                this.removeDialog();
                                if (shelved === true)
                                    this.openReceiptFromID(rid);
                                else
                                    this.showOldReceipt(receipt);
                            }.bind(this);
                            return <div key={rid} onClick={loadOldReceipt} className="receipt_product">
                                {FormatTime(receipt.receiptInfo.time)} {totalAmount}st | {totalPrice}kr
                            </div>;
                        }, this)}
                    </div>

                    <div className="dialog-footer">
                        <button className="dialog-button-cancel" onClick={this.removeDialog}>Avbryt</button>
                    </div>
                </Dialog>),
                this.dialogDiv()
            );
        }.bind(this));
    },

    openReceiptFromID: function (id) {
        this.firebaseReceiptRef.off();
        history.pushState(null, null, '#' + id);
        this.receiptID = id;
        this.firebaseReceiptRef.child(this.receiptID).on("value", function (dataSnapshot) {
            this.setReceipt(dataSnapshot.val());
        }.bind(this));
    },

    showOldReceipt: function (receipt) {
        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 400, height: 300}}>
                {FormatTime(receipt.receiptInfo.time)}
                <p>Ditt kvitto:</p>

                <div className="dialog-receipt-list">
                    {_.map(receipt.products, function (productLine, rid) {
                        console.log(productLine);
                        return <div key={rid} className="receipt_product">
                            {productLine.product.name} {productLine.amount}st
                            | {productLine.product.price * productLine.amount}kr
                        </div>;
                    }, this)}
                </div>

                <div className="dialog-footer">
                    <button className="dialog-button-cancel" onClick={this.removeDialog}>Avbryt</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },

    finishedAction: function () {
        var receiptDone = function () {
            var finishedFirebaseReceiptRef = new Firebase("https://lohnn-riajs.firebaseio.com/finished-receipts/");
            console.log(this.state.receipt);
            finishedFirebaseReceiptRef.child(this.receiptID).set(JSON.parse(JSON.stringify(this.state.receipt)));
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
            <div className="purchase_buttons_finished" onClick={this.listOldReceipts}>Gamla</div> :
            <div className="purchase_buttons_finished" onClick={this.finishedAction}>Klar</div>;
        var shelvedButton = (this.getTotalProducts() <= 0) ?
            <div className="purchase_buttons_finished purchase_buttons_cancel" onClick={function () {
                this.listOldReceipts(true);
            }.bind(this)}>Kvittohylla</div> :
        {};
        return <div id="main" className="container">
            <div id="dialog-div"/>
            <div className="purchase_part">
                <div className="receipt">
                    {RenderReceipt({
                        items: this.state.receipt.products,
                        functionToRun: this.removeLineFromReceipt,
                        updateLineAmountFunction: this.updateLineAmount
                    })}
                </div>
                <div className="summary">
                    <div className="sum_amount">{this.getTotalProducts() + "st"}</div>
                    <div className="discount_percent" onClick={this.setPercentDiscountDialog}>
                        {"Rabatt: " + this.getPercentDiscount() + "%"}
                    </div>
                    <div className="sum_price">{this.getTotalPrice() + "kr"}</div>
                </div>
                <div className="purchase_buttons">
                    <div className="fill_width float_left">
                        <div className="purchase_buttons_discount" onClick={this.addDiscount}>Rabatt</div>
                        {finishedOrList}
                    </div>
                    <a href="#" className="purchase_buttons_cancel float_left" onClick={this.cancelDialog}>Avbryt</a>
                    {shelvedButton}
                </div>
            </div>
            <div className="product_part">
                {RenderProducts({items: this.state.products, functionToRun: this.addToReceipt})}
            </div>
        </div>;
    }
});

module.exports = App;
