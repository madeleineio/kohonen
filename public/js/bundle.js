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
	
	console.log(kohonen.step());

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
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	
	var MatrixProto = __webpack_require__(5);
	var VectorProto = __webpack_require__(7);
	
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	
	var VectorProto = __webpack_require__(7);
	
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	
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

/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map