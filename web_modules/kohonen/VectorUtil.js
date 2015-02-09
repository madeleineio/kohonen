/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');

module.exports = {
    mult: function(v, coef){
        return v.map(function(val){
            return val * coef;
        });
    },
    add: function(v1, v2){
        return v1.map(function(val, i){
            return val + v2[i];
        });
    },
    diff: function(v1, v2){
        return v1.map(function(val, i){
            return v2[i] - val;
        });
    },
    dist: function(v1, v2){
        return Math.sqrt(_.reduce(v1.map(function(val, i){
            return Math.pow(v2[i] - val, 2);
        }), function(sum, val){
            return sum + val;
        }));
    },
    generate: function(dim){
        return _.range(0, dim).map(function(){
            return Math.random();
        });
    }
};
