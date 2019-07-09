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
import { withStyles } from "@material-ui/core/styles";

const styles = {
  card: {
    position: "relative",
    width: "100%",
    padding: "0.75rem",
    "&:after": {
      content: `''`,
      display: "block",
      paddingBottom: "50%"
    },
    boxSizing:'border-box'
  },
  title: {
    fontSize: "1rem",
    color: "white"
  },
  data: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white"
  },
  icon: {
    width: "auto",
    height: "2rem",
    fill: "white"
  },
  cardContent: {
    position: "absolute",
    bottom: 0
  }
};

class HorizontalSeries extends React.Component {
  state = {
    value: false
  };
  _chartWidth = (width) =>{
    if(width<600) return width*0.8
    if(width<960) return width*0.8/2
    return width*0.8/3
  }
  render() {
    const { classes } = this.props;
    const maxLabelLength = this.props.data.reduce(function(a, v) {
      if (a.y.length < v.y.length) return v;
      return a;
    }).y.length;
    return (
      <div
        className={classes.card}
        style={{
          backgroundImage: `linear-gradient(135deg,${this.props.color[0]},${
            this.props.color[1]
          }`,
        }}
      >
        <div className={classes.cardContent}>
          <h2 className={classes.title}>{this.props.title}</h2>
          <XYPlot
            width={this._chartWidth(this.props.width)}
            height={this._chartWidth(this.props.width)/2 * 0.8}
            margin={{ left: maxLabelLength * 8 + 10 }}
            yType="ordinal"
            onMouseLeave={() => this.setState({ value: false })}
          >
            <VerticalGridLines />
            <XAxis />
            <YAxis />
            <HorizontalBarSeries
              color="white"
              data={this.props.data}
              onNearestXY={value => this.setState({ value })}
            />
            {this.state.value ? <Hint value={this.state.value} /> : null}
          </XYPlot>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalSeries)
