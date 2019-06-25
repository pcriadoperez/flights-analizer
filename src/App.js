import React from 'react';
import './App.css';
import Uploader from './components/uploader'
import Map from './components/Map'
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import 'react-vis/dist/style.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";




const styles = {
  root: {
    flexGrow: 1
    },
  row: {
    padding: 20
  },
  button: {
    marginTop: 1,
    marginRight: 1,
  },
  actionsContainer: {
    marginBottom: 2,
  },
  resetContainer: {
    padding: 3,
  },
};

function getSteps() {
  return ['Download your Location History from Google', 'Upload your location history', 'Enjoy your data', 'Share with friends'];
}
function getStepDescription(step) {
  switch (step) {
    case 0:
      return `Go to Google Takeout and download your history. Unzip the file.`;
    case 1:
      return `Upload your file. No worries we value your data privacy and won't keep any of this data `;
    case 2:
      return `Wow, that's a bunch of data!`;
    case 3:
      return `Life is better sharing little things. Find out where your friends have been too`
    default:
      return 'Unknown step';
  }
}
function getStepContent(step) {
  switch (step) {
    case 0:
      return `Go to Google Takeout and download your history. Unzip the file.`;
    case 1:
      return `Upload your file. No worries we value your data privacy and won't keep any of this data `;
    case 2:
      return `Wow, that's a bunch of data!`;
    case 3:
      return `Life is better sharing little things. Find out where your friends have been too`
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    }
  }
  handleNext = (e) => {
    this.setState({activeStep:  this.state.activeStep + 1});
  }

  handleBack = (e) =>{
    this.setState({activeStep:  this.state.activeStep - 1});
  }

  handleReset = (e) =>{
    this.setState({activeStep:  0});
  }
  render(){
    const { classes } = this.props;
    const steps = getSteps();
  return (
    <div className={classes.root}>
      <Stepper activeStep={this.state.activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepDescription(index)}</Typography>
              { index=== 0 && <a href="https://takeout.google.com/settings/takeout" target="_blank">Download from Google Takeoot </a>}
              { index===1 && <Uploader onDataChange={d => this.setState({trips: d})} onDone={e => this.setState({activeStep:  this.state.activeStep + 1})}/> }
              { index===2 && <Map trips={this.state.trips}/> }
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {this.state.activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={this.handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
}

function Maps({ match }) {
  return(
    <Route path={`${match.path}/:id`} component={Map} />
  )
  }

class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      trips:[]
    }
  }
  render(){
    const { classes } = this.props;
    return (
      <Router>
         <Route path="/map" component={Maps} />
            <Grid className={classes.root} container direction="column"  alignItems="stretch" >
            <VerticalLinearStepper classes={classes}/>
                <Grid item className={classes.row} >
                
                </Grid>
                  
              </Grid>
        </Router>

    );
  }
}

export default withStyles(styles)(App)
