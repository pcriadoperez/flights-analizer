import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  card: {
    boxSizing: "border-box",
    position: "relative",
    width: "100%",
    padding: "0.75rem",
    "&:after": {
      content: `''`,
      display: "block",
      paddingBottom: "100%"
    }
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

class DashboardCard extends React.Component {
  render() {
    const { classes } = this.props;
    const Icon = this.props.icon;
    return (
      <div
        className={classes.card}
        style={{
          backgroundImage: `linear-gradient(135deg,${this.props.color[0]},${
            this.props.color[1]
          }`,
          width: this.props.width ? this.props.width : classes.card.width
        }}
      >
        <div className={classes.cardContent}>
          {this.props.icon && <Icon className={classes.icon} />}
          <div className={classes.title}>{this.props.title}</div>
          {this.props.data && <div className={classes.data}>
            {`${this.props.data} ${this.props.unit}`}
          </div>}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DashboardCard);
