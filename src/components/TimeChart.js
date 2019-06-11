import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  LineSeries,
  Crosshair,
  VerticalRectSeries
} from 'react-vis';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';





export default class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          crosshairValues: []
        }
      }
      /**
   * A callback to format the crosshair items.
   * @param {Object} values Array of values.
   * @returns {Array<Object>} Array of objects with titles and values.
   * @private
   */
  _formatCrosshairItems = values => {
    const {series} = this.state;
    return values.map((v, i) => {
      return {
        title: "Distance",
        value: v.top
      };
    });
  };

  /**
   * Format the title line of the crosshair.
   * @param {Array} values Array of values.
   * @returns {Object} The caption and the value of the title.
   * @private
   */
  _formatCrosshairTitle = values => {
    return {
      title: 'Trips',
      value: values[0].left
    };
  };
  
  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler = () => {
    this.setState({crosshairValues: []});
  };
  render() {
    let lineData = []
    let barData = []
    //bucket distance per month
    this.props.data.forEach(trip => {
        if(lineData.length === 0 ) {
            lineData.push({x:trip.to.date, y:trip.distance})
            barData.push({x:trip.to.date, y:1})
        }
        if(trip.to.date.getMonth() === lineData[lineData.length -1 ].x.getMonth()){
            lineData[lineData.length-1].y +=trip.distance
            barData[barData.length -1].y +=1
        }
        else{
            lineData.push({x:trip.to.date, y:trip.distance})
            barData.push({x:trip.to.date, y:1})
        }
    })
    //Convert Dates
    lineData = lineData.map(e=>( {x:e.x.getTime(), y: e.y}))
    barData = barData.map(e=>({ x:e.x.getTime(), y: e.y}))
    let barDataMax = barData.reduce(function(a,v){
        if(a.y<v.y) return v
        else return a
    }).y
    console.log(lineData)
    console.log(barData)
    return (
        <XYPlot width={window.outerWidth - 50} height={100} xType="time" yType="linear" onMouseLeave={this._mouseLeaveHandler}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <LineSeries data={lineData} />
          <VerticalRectSeries data={barData} onNearestX={this._nearestXHandler} yDomain={[barDataMax, 0]} yRange={[barDataMax,0]}/>
          <Crosshair
              itemsFormat={this._formatCrosshairItems}
              titleFormat={this._formatCrosshairTitle}
              values={this.state.crosshairValues}
            />
        </XYPlot>
    );
  }
}