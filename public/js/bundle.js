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
	
	__webpack_require__(9);
	
	var React = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var d3 = __webpack_require__(3);
	
	var kohonen = __webpack_require__(4);
	var Neuron = __webpack_require__(5);
	
	var margin = 50;
	
	/**
	 *
	 */
	var Kohonen = React.createClass({displayName: "Kohonen",
	    getInitialState: function () {
	        return {
	            kohonen: kohonen.init(this.props.x, this.props.y, this.props.l)
	        }
	    },
	    componentDidMount: function () {
	        function step() {
	            if (this.state.kohonen.currentStep < 10000) {
	                this.setState({
	                    kohonen: this.state.kohonen.learn()
	                });
	                window.requestAnimationFrame(step.bind(this))
	            } else {
	                alert('learning completed');
	            }
	        };
	        window.requestAnimationFrame(step.bind(this));
	    },
	    render: function () {
	        var w = $('body').width();
	        var h = $('body').height();
	        var scaleX = d3.scale.linear()
	            .domain([0, this.props.x - 1])
	            .range([margin, w - margin]);
	        var scaleY = d3.scale.linear()
	            .domain([0, this.props.y - 1])
	            .range([margin, h - margin]);
	
	        return (
	            React.createElement("svg", {className: 'svg-kohonen'}, 
	                this.state.kohonen.matrix.neurons.map(function (n, k) {
	                    return React.createElement(Neuron, {
	                        key: k, 
	                        r: (scaleX(1) - scaleX(0)) / 1.3, 
	                        neuron: n, 
	                        cx: scaleX(n.x), 
	                        cy: scaleY(n.y)})
	                }), 
	                React.createElement("text", {className: 'text-learning-step', x: w/2, y: h/2}, 'training steps : ' + this.state.kohonen.currentStep)
	            )
	        );
	    }
	});
	
	
	$(function () {
	    React.render(
	        React.createElement(Kohonen, {x: 20, y: 20, l: 3}),
	        $('body').get(0)
	    );
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = jQuery;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = d3;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * http://en.wikipedia.org/wiki/Self-organizing_map
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	var d3 = __webpack_require__(3);
	
	var MatrixProto = __webpack_require__(7);
	var VectorUtil = __webpack_require__(8);
	
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
	        return this;
	    },
	
	    currentStep: 0,
	
	    /**
	     * scale function to decrease neighborhood function return with time
	     */
	    scaleStepNeighborhood: d3.scale.linear()
	        .domain([0, 10000])
	        .range([1,.3])
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
	        .domain([0,10000])
	        .range([1,.3])
	        .clamp(true),
	
	    learningCoef: function(s){
	        return this.scaleStepLearningCoef(s);
	    },
	
	    learn: function () {
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
	        return this;
	    }
	
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var d3 = __webpack_require__(3);
	var $ = __webpack_require__(2);
	
	var scaleColor = d3.scale.linear()
	    .domain([0,1])
	    .range([0,255]);
	
	var Neuron = React.createClass({displayName: "Neuron",
	    render: function () {
	        var style = {
	            fill: d3.rgb(
	                scaleColor(this.props.neuron.vec[0]),
	                scaleColor(this.props.neuron.vec[1]),
	                scaleColor(this.props.neuron.vec[2])
	            )
	        };
	        return (
	            React.createElement("circle", {
	                style: style, 
	                cx: this.props.cx, 
	                cy: this.props.cy, 
	                r: this.props.r})
	        );
	    }
	});
	
	module.exports = Neuron;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(6);
	
	var NeuronProto = __webpack_require__(12);
	var VectorUtil = __webpack_require__(8);
	
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
	            _.range(0, x).map(function (i) {
	                return _.range(0, y).map(function (j) {
	                    return Object.create(NeuronProto).init(i, j, l);
	                })
	            })
	        );
	        // chaining pattern
	        return this;
	    },
	
	    findBestMatchingUnit: function (v) {
	        return _.sortBy(this.neurons, function (neuron) {
	            return VectorUtil.dist(neuron.vec, v);
	        })[0];
	    }
	};

/***/ },
/* 8 */
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(11)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/node_modules/css-loader/index.js!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/node_modules/sass-loader/index.js!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/sass/style.scss", function() {
			var newContent = require("!!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/node_modules/css-loader/index.js!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/node_modules/sass-loader/index.js!/Users/nmondon/PhpstormProjects/madeleineio/kohonen/sass/style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	exports.push([module.id, "html,body{margin:0;width:100%;height:100%}.svg-kohonen{width:100%;height:100%}.svg-kohonen .text-learning-step{font-family:\"Helvetica Neue Light\",\"HelveticaNeue-Light\",\"Helvetica Neue\",Calibri,Helvetica,Arial;font-size:40px;text-anchor:middle}", ""]);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by nicolasmondon on 09/02/15.
	 */
	
	'use strict';
	
	var _ = __webpack_require__(6);
	var VectorUtil = __webpack_require__(8);
	
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map