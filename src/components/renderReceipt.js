/**
 * Created by jl222xa on 2014-12-11.
 */

var React = require('react');
var _ = require('lodash');

var RenderReceipt = React.createClass({
    addProduct: function (productLine, pid) {
        return <div key={pid} className="receipt_product">
            <div className="product_amount" onClick={function () {
                this.props.updateLineAmountFunction(productLine);
            }.bind(this)}>{productLine.amount + "st"}</div>
            <div className="product_name">{productLine.getName()}</div>
            <div className="product_remove" onClick={function () {
                this.props.functionToRun(productLine.product);
            }.bind(this)}>X</div>
            <div className="product_price">{productLine.getTotalPrice() + "kr"}</div>
        </div>;
    },
    render: function () {
        return <div>
        {_.map(this.props.items, this.addProduct)}
        </div>;
    }
});

module.exports = RenderReceipt;
