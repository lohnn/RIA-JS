/**
 * Created by jl222xa on 2014-12-04.
 */

var _ = require('lodash');

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

    this.productLines = {};

    this.setProducts = function (products) {
        _.map(products, function (product) {
            //console.log(product.key());
            this.addProduct(product);
        }, this);
    };

    this.addProduct = function (product, amount) {
        amount = typeof amount !== 'undefined' ? amount : 1;

        if (product.name in this.productLines) {
            this.productLines[product.name].amount += amount;
        } else {
            this.productLines[product.name] = new Product_line(product);
        }
    };

    this.getTotalProducts = function () {
        var temp = 0;
        _.map(this.productLines, function (element) {
            temp += element.amount;
        });
        return temp;
    };

    this.getTotalPrice = function () {
        var temp = 0;
        _.map(this.productLines, function (element) {
            temp += element.getTotalPrice();
        });
        return temp;
    };

    this.clearProducts = function () {
        this.productLines = [];
    };
};

module.exports = Receipt;
