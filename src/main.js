/**
 * Created by lohnn on 2014-11-24.
 */

var App = require('./components/app');
var ProductEdit = require('./components/productEditPage');
var React = require('react');

var command = window.location.hash.substring(1);

switch (command) {
    case "productlist":
        React.
            render(
            ProductEdit(),
            document.body
        );
        break;
    default:
        React.
            render(
            App(),
            document.body
        );
        break;
}
