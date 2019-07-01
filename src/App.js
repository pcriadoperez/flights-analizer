import React from 'react';
import './App.css';
import Map from './components/Map'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import 'react-vis/dist/style.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './components/Home'




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
  }
};






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
          <Route exact path='/' component={Home} />
        </Router>

    );
  }
}

export default withStyles(styles)(App)
