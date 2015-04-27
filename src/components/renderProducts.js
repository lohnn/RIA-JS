/**
 * Created by jl222xa on 2014-12-11.
 */

var React = require('react');
var _ = require('lodash');

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

module.exports = RenderProducts;