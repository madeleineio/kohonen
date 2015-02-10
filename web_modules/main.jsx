'use strict';

require('style.scss');

var React = require('react');
var $ = require('jquery');
var d3 = require('d3');

var kohonen = require('kohonen/kohonen');
var Neuron = require('components/Neuron');

var margin = 50;

/**
 *
 */
var Kohonen = React.createClass({
    getInitialState: function () {
        return {
            kohonen: kohonen.init(this.props.x, this.props.y, this.props.l)
        }
    },
    componentDidMount: function(){
        function step(){
            if(this.state.kohonen.currentStep < 10000){
                this.setState({
                    kohonen: this.state.kohonen.learn()
                });
                window.requestAnimationFrame(step.bind(this))
            }else {
                alert('learning completed');
            }
        };
        window.requestAnimationFrame(step.bind(this));
    },
    render: function () {
        var scaleX =  d3.scale.linear()
            .domain([0,this.props.x-1])
            .range([margin, $('body').width() - margin]);
        var scaleY = d3.scale.linear()
            .domain([0,this.props.y-1])
            .range([margin, $('body').height() - margin]);

        return (
            <svg className={'svg-kohonen'}>
            {this.state.kohonen.matrix.neurons.map(function (n,k) {
                return <Neuron
                    key={k}
                    neuron={n}
                    cx={scaleX(n.x)}
                    cy={scaleY(n.y)}/>
            })}
            </svg>
        );
    }
});


$(function () {
    React.render(
        <Kohonen x={20} y={20} l={3}/>,
        $('body').get(0)
    );
});

kohonen.init(3, 4, 5);
kohonen.step();
