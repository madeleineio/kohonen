'use strict';

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var scaleColor = d3.scale.linear()
    .domain([0,1])
    .range([0,255]);

var Neuron = React.createClass({
    statics: {
        r: 40
    },
    render: function () {
        var style = {
            fill: d3.rgb(
                scaleColor(this.props.neuron.vec[0]),
                scaleColor(this.props.neuron.vec[1]),
                scaleColor(this.props.neuron.vec[2])
            )
        };
        return (
            <circle
                style={style}
                cx={this.props.cx}
                cy={this.props.cy}
                r={Neuron.r} />
        );
    }
});

module.exports = Neuron;