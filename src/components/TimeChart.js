/* eslint-disable no-underscore-dangle */
import React from "react";
import {
  XYPlot,
  XAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  LineSeries,
  Crosshair
} from "react-vis";

export default class TimeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crosshairValues: [],
      width: window.innerWidth - 100
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }

  _resize = () => {
    this.setState({ width: window.innerWidth - 120 });
  };

  /**
   * A callback to format the crosshair items.
   * @param {Object} values Array of values.
   * @returns {Array<Object>} Array of objects with titles and values.
   * @private
   */
  _formatCrosshairItems = values => {
    return values.map((v, i) => {
      return {
        title: i === 0 ? "Trips" : "Distance",
        value: i === 0 ? v.y : `${Math.round(v.y)}km`
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
    const options = { year: "numeric", month: "short" };
    return {
      title: new Date(values[0].x).toLocaleDateString("en-US", options),
      value: null
    };
  };

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler = () => {
    this.setState({ crosshairValues: [] });
  };

  _nearestXHandler = (val, { index }) => {
    this.setState({ crosshairValues: [val, this.lineData[index]] });
  };

  _updateHighlightWidth = time => {};

  render() {
    this.lineData = [];
    let barData = [];
    // bucket distance per month
    this.props.data.forEach(trip => {
      if (this.lineData.length === 0) {
        this.lineData.push({ x: trip.to.date, y: 0 });
        barData.push({ x: trip.to.date, y: 0 });
      }
      // Fill empty months with zero
      while (
        trip.to.date.getMonth() !==
        this.lineData[this.lineData.length - 1].x.getMonth()
      ) {
        const newDate = new Date(this.lineData[this.lineData.length - 1].x);
        newDate.setMonth(
          this.lineData[this.lineData.length - 1].x.getMonth() + 1
        );
        this.lineData.push({ x: newDate, y: 0 });
        barData.push({ x: newDate, y: 0 });
      }
      if (
        trip.to.date.getMonth() ===
        this.lineData[this.lineData.length - 1].x.getMonth()
      ) {
        this.lineData[this.lineData.length - 1].y += trip.distance;
        barData[barData.length - 1].y += 1;
      } else {
        this.lineData.push({ x: trip.to.date, y: trip.distance });
        barData.push({ x: trip.to.date, y: 1 });
      }
    });
    // Convert Dates
    this.lineData = this.lineData.map(e => ({ x: e.x.getTime(), y: e.y }));
    barData = barData.map(e => ({ x: e.x.getTime(), y: e.y }));
    const barDataMax = barData.reduce(function(a, v) {
      if (a.y < v.y) return v;
      return a;
    }).y;
    // console.log(this.props.data)
    // console.log(barData)
    // console.log(this.props.time)
    return (
      <XYPlot
        margin={{ left: 10, right: 0, top: 10, bottom: 30 }}
        width={this.state.width}
        height={100}
        xType="time"
        yType="linear"
        onMouseLeave={this._mouseLeaveHandler}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <VerticalBarSeries
          color="#4C9FFE"
          data={barData}
          onNearestX={this._nearestXHandler}
          yDomain={[0, barDataMax + 1]}
        />
        <LineSeries
          color="#FFCB23"
          data={this.lineData}
          curve="curveMonotoneX"
        />
        <Crosshair
          itemsFormat={this._formatCrosshairItems}
          titleFormat={this._formatCrosshairTitle}
          values={this.state.crosshairValues}
          color="#1E3CA0"
        />
      </XYPlot>
    );
  }
}
