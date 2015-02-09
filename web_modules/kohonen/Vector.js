/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');

module.exports = {
    x: 0,
    y: 0,
    el: null,
    init: function (x,y,l) {
        this.x = x;
        this.y = y;
        this.el = _.range(0, l).map(function () {
            return Math.random();
        });
        // chaining pattern
        return this;
    },
    get: function (i) {
        return this.el[i];
    },
    diff: function(v){
        return _.reduce(this.el.map(function(val, i){
            return Math.abs(v.get(i) - val);
        }), function(sum, val){
            return sum + val;
        })
    }
};