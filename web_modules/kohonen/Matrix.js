/**
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');

var NeuronProto = require('kohonen/Neuron');
var VectorUtil = require('kohonen/VectorUtil');

module.exports = {

    neurons: null,
    /**
     * create a random matrix
     * @param x
     * @param y
     * @param l
     */
    init: function (x, y, l) {
        this.neurons = _.flatten(
            _.range(0, x).map(function () {
                return _.range(0, y).map(function () {
                    return Object.create(NeuronProto).init(x, y, l);
                })
            })
        );
        // chaining pattern
        return this;
    },

    findBestMatchingUnit: function (v) {
        return _.sortBy(this.neurons, function (neuron) {
            return VectorUtil(neuron.vec, v);
        })[0];
    }
};