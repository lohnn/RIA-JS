/**
 * Created by jl222xa on 2014-12-11.
 */

var React = require('react');
var _ = require('lodash');

var RenderProducts = React.createClass({
    addProduct: function (product, pid) {
        return <div key={pid} className="product_part_product">
            <img alt={product.name} src={product.image} onClick={function () {
                this.props.functionToRun(product);
            }.bind(this)}/>
            {product.name}
        </div>;
    },
    render: function () {
        var toAdd = (this.props.command === "ADD") ?
            this.addProduct({image: "images/add.png", name: "Lägg till", command: "ADD"}) : {};
        return <div>
            {_.map(this.props.items, this.addProduct, this)}
            {toAdd}
        </div>;
    }
});

module.exports = RenderProducts;