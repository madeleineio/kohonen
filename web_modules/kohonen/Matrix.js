/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');

var VectorProto = require('kohonen/Vector');

module.exports = {
    el: null,
    /**
     * create a random matrix
     * @param x
     * @param y
     * @param l
     */
    init: function (x, y, l) {
        this.el = _.range(0, x).map(function () {
            return _.range(0, y).map(function () {
                return Object.create(VectorProto).init(x,y,l);
            })
        });
        // chaining pattern
        return this;
    },

    findClosestVector: function(v){
        return  _.sortBy(_.flatten(this.el), function(vec){
            return vec.diff(v);
        })[0];
    }
};