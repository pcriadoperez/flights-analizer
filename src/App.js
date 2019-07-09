import React from "react";
import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import Map from "./components/Map";
import "react-vis/dist/style.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import UploadHistoryPage from "./components/UploadHistoryPage";
import { AnimatedSwitch } from "react-router-transition";
import Faq from "./components/Faq";

const styles = {
  root: {
    flexGrow: 1
  },
  row: {
    padding: 20
  },
  button: {
    marginTop: 1,
    marginRight: 1
  },
  actionsContainer: {
    marginBottom: 2
  },
  resetContainer: {
    padding: 3
  }
};

function Maps({ match }) {
  return <Route path={`${match.path}/:id`} component={Map} />;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: []
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id" component={Map} />
        <Route exact path="/menu/upload" component={UploadHistoryPage} />
        <Route exact path="/menu/faq" component={Faq} />
      </Router>
    );
  }
}

export default withStyles(styles)(App);
