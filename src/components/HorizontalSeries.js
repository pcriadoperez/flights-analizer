import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  Hint } from 'react-vis';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';




export default class HorizontalSeries extends React.Component {
    state = {
        value: false
      };
    
  render() {
      console.log(this.state.value)
    let maxLabelLength = this.props.data.reduce(function(a,v){
        if(a.y.length < v.y.length) return v
        else return a
          }).y.length
    console.log(maxLabelLength)
    return (
      <Card>
          <CardContent>
          <Typography variant="h5" component="h2">{this.props.title}</Typography>
        <XYPlot width={window.outerWidth - 200} height={this.props.data.length * 25+50}
        margin={{left:maxLabelLength*8+10}} yType={'ordinal'}  onMouseLeave={() => this.setState({value: false})}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis/>
          <HorizontalBarSeries data={this.props.data} onNearestXY={value => this.setState({value})}/>
          {this.state.value ? <Hint value={this.state.value} /> : null}
        </XYPlot>
        </CardContent>
      </Card>
    );
  }
}