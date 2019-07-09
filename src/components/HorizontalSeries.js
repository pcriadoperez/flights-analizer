import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  Hint
} from "react-vis";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default class HorizontalSeries extends React.Component {
  state = {
    value: false
  };

  render() {
    const maxLabelLength = this.props.data.reduce(function(a, v) {
      if (a.y.length < v.y.length) return v;
      return a;
    }).y.length;
    return (
      <Card>
        <CardContent>
          <h2>{this.props.title}</h2>
          <XYPlot
            width={555}
            height={225}
            margin={{ left: maxLabelLength * 8 + 10 }}
            yType="ordinal"
            onMouseLeave={() => this.setState({ value: false })}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <HorizontalBarSeries
              color="#4C9FFE"
              data={this.props.data}
              onNearestXY={value => this.setState({ value })}
            />
            {this.state.value ? <Hint value={this.state.value} /> : null}
          </XYPlot>
        </CardContent>
      </Card>
    );
  }
}
