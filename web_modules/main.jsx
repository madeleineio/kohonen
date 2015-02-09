'use strict';

var d3 = require('d3');
var React = require('react');
var $ = require('jquery');

var kohonen = require('kohonen/kohonen');

kohonen.init(3,4,5);

console.log(kohonen.step());