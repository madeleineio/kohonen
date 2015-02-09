/**
 * http://en.wikipedia.org/wiki/Self-organizing_map
 * Created by nicolasmondon on 09/02/15.
 */

'use strict';

var _ = require('lodash');
var d3 = require('d3');

var MatrixProto = require('kohonen/Matrix');
var VectorUtil = require('kohonen/VectorUtil');

module.exports = {

    matrix: null,

    x: 0,

    y: 0,

    l: 0,

    init: function (x, y, l) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.matrix = Object.create(MatrixProto).init(x, y, l);
    },

    currentStep: 0,

    /**
     * scale function to decrease neighborhood function return with time
     */
    scaleStepNeighborhood: d3.scale.linear()
        .domain([0, 250])
        .range([1,.75])
        .clamp(true),

    /**
     * http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
     * @param u bmu neuron
     * @param v neighbor
     * @param s current iteration
     */
    neighborhood: function (u, v, s) {
        var a = 1,
            sigmaX = 1,
            sigmaY = 1;
        return a * Math.exp(-(
                Math.pow(v.x - u.x, 2)/2*Math.pow(sigmaX, 2)
                +
                Math.pow(v.y - u.y, 2)/2*Math.pow(sigmaY, 2)
            ))*this.scaleStepNeighborhood(s);
    },

    scaleStepLearningCoef: d3.scale.linear()
        .domain([0,250])
        .range([1,.5])
        .clamp(true),

    learningCoef: function(s){
        return this.scaleStepLearningCoef(s);
    },

    step: function () {
        // generate a new vector
        var v = VectorUtil.generate(this.l);
        // find bmu
        var bmu = this.matrix.findBestMatchingUnit(v);
        // compute current learning coef
        var currentLearningCoef = this.learningCoef(this.currentStep);
        // updates neurons' vector
        this.matrix.neurons.forEach(function(n){
            // compute neighborhood function for current neuron
            var currentNeighborhood = this.neighborhood(bmu, n, this.currentStep);
            // compute delta
            var delta = VectorUtil.mult(
                VectorUtil.diff(n.vec, v),
                currentNeighborhood * currentLearningCoef
            );
            // update current neuron's vector
            n.setVector(VectorUtil.add(n.vec, delta));
        }, this);
        // increment step
        this.currentStep++;
    }

};