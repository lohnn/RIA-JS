/**
 * Created by lohnn on 2014-11-28.
 */

/** @jsx React.DOM */
var path = '../../src/components/jesttest.js';

jest.dontMock(path);

describe("sum", function () {
    it('adds 1 + 2 to equal 3', function () {
        var sum = require(path);
        expect(sum(1, 2)).toBe(3);
    });
});