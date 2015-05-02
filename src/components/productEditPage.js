/**
 * Created by lohnn on 2015-05-01.
 */

var React = require('react');
var RenderProducts = require("./renderProducts");
var Firebase = require("firebase");
var Dialog = require('./dialog');
var _ = require("lodash");


var productEditPage = React.createClass({
    getInitialState: function () {
        return {
            products: {}
        };
    },
    componentWillMount: function () {
        this.firebaseProductsRef = new Firebase("https://lohnn-riajs.firebaseio.com/products");
        this.firebaseProductsRef.on("value", function (dataSnapshot) {
            this.setState({products: dataSnapshot.val()});
        }.bind(this));
    },
    removeDialog: function () {
        React.unmountComponentAtNode(this.dialogDiv());
    },
    dialogDiv: function () {
        return document.getElementById("dialog-div");
    },
    editProduct: function (product) {
        var image = product.image, name = product.name, price = product.price;
        var confirmAction = function () {
            product.image = image;
            product.name = name;
            product.price = price;
            this.setState({products: this.state.products});
            this.firebaseProductsRef.set(this.state.products);
            this.removeDialog();
        }.bind(this);

        React.render(
            (<Dialog onClose={this.removeDialog} style={{width: 300, height: 200}}>
                <p>Produktens uppgifter</p>

                <div>
                    <label className="left width75" htmlFor="image">Produktbild: </label>
                    <input type="text" id="image" defaultValue={image} onChange={function (event) {
                        image = event.target.value;
                    }}/>
                </div>
                <div>
                    <label className="left width75" htmlFor="name">Namn: </label>
                    <input type="text" id="name" defaultValue={name} onChange={function (event) {
                        name = event.target.value;
                    }}/>
                </div>
                <div>
                    <label className="left width75" htmlFor="price">Pris (kr): </label>
                    <input type="number" id="price" min="0" onChange={function (event) {
                        price = +event.target.value;
                    }} defaultValue={price}/>
                </div>

                <div className="dialog-footer">
                    <button onClick={this.removeDialog} className="dialog-button-cancel">Avbryt</button>
                    <button onClick={confirmAction} className="dialog-button-confirm">Klar</button>
                </div>
            </Dialog>),
            this.dialogDiv()
        );
    },
    render: function () {
        return <div>
            <div id="dialog-div"/>
            {RenderProducts({
                items: this.state.products, functionToRun: this.editProduct
            })}
        </div>;
    }
});

module.exports = productEditPage;