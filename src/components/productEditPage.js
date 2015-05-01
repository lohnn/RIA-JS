/**
 * Created by lohnn on 2015-05-01.
 */

var React = require('react');
var RenderProducts = require("./renderProducts");
var Firebase = require("firebase");


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
    editProduct: function (product) {
        console.log(product);
    },
    render: function () {
        return <div>
            {RenderProducts({
                items: this.state.products, functionToRun: this.editProduct
            })}
        </div>;
    }
});

module.exports = productEditPage;