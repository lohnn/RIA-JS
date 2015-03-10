/**
 * Created by jl222xa on 2014-12-04.
 */

var _ = require('lodash');

var Product_line = function (product, amount) {
    if (!(this instanceof Product_line))
        return new Product_line(product);

    this.product = product;
    this.amount = typeof amount !== 'undefined' ? amount : 1;

    this.getName = function () {
        return this.product.name;
    };

    this.getTotalPrice = function () {
        return this.product.price * this.amount;
    };
};

var Receipt = {
    setInfo: function(info){
        this.state.receipt.receiptInfo = info;
    },

    setProducts: function (products) {
        _.map(products, function (product) {
            if (product.name in this.state.receipt.products) {
                this.state.receipt.products[product.product.name].amount = product.amount;
            } else {
                this.state.receipt.products[product.product.name] = new Product_line(product.product, product.amount);
            }
        }, this);
    },

    addProduct: function (product, amount) {
        amount = typeof amount !== 'undefined' ? amount : 1;
        if (product.name in this.state.receipt.products) {
            this.state.receipt.products[product.name].amount += amount;
        } else {
            this.state.receipt.products[product.name] = new Product_line(product, amount);
        }
    },

    removeProduct: function (product) {
        delete this.state.receipt.products[product.name];
    },

    getTotalProducts: function () {
        var temp = 0;
        _.map(this.state.receipt.products, function (element) {
            temp += element.amount;
        });
        return temp;
    },

    getTotalPrice: function () {
        var temp = 0;
        _.map(this.state.receipt.products, function (element) {
            temp += element.getTotalPrice();
        });
        return temp;
    },

    clearProducts: function () {
        this.state.receipt.products = {};
    }
};

module.exports = Receipt;