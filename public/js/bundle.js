/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var d3 = __webpack_require__(1);
	var React = __webpack_require__(2);
	var $ = __webpack_require__(3);
	
	var kohonen = __webpack_require__(4);
	
	kohonen.init(3,4,5);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = d3;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = jQuery;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * http://en.wikipedia.org/wiki/Self-organizing_map
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	var d3 = __webpack_require__(1);
	
	var MatrixProto = __webpack_require__(5);
	var VectorUtil = __webpack_require__(9);
	
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	
	var NeuronProto = __webpack_require__(8);
	var VectorUtil = __webpack_require__(9);
	
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	var VectorUtil = __webpack_require__(9);
	
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	
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


/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map