/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');

var MatrixProto = require('kohonen/Matrix');
var VectorProto = require('kohonen/Vector');

module.exports = {

    matrix: null,

    x: 0,

    y: 0,

    l: 0,

    init: function(x,y,l){
        this.x = x;
        this.y = y;
        this.l = l;
        this.matrix = Object.create(MatrixProto).init(x,y,l);
    },

    step: function(){
        var v = Object.create(VectorProto).init(null, null, this.l);
        return this.matrix.findClosestVector(v);
    }

};