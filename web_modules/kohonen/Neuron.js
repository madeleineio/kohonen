/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');
var VectorUtil = require('kohonen/VectorUtil');

module.exports = {
    x: 0,
    y: 0,
    vec: null,
    init: function (x,y,l) {
        this.x = x;
        this.y = y;
        this.vec = VectorUtil.generate(l);
        // chaining pattern
        return this;
    },
    setVector: function(v){
        this.vec = v;
    },
    /**
     * @param n
     */
    distanceFromNeuron: function(n){
        return VectorUtil.dist([this.x, this.y], [n.x, n.y]);
    }
};