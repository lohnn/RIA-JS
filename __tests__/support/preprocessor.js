/**
 * Created by lohnn on 2014-11-28.
 */

var ReactTools = require('react-tools');
module.exports = {
    process: function (src) {
        return ReactTools.transform(src);
    }
};