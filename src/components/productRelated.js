/**
 * Created by jl222xa on 2014-12-04.
 */

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

module.exports = Receipt;