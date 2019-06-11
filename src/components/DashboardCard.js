import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles  ={
    card: {
      width: 275,
      padding: 10
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }

class DashboardCard extends React.Component{
    render(){
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {this.props.title}
                </Typography>
                <Typography variant="body2" component="p">
                  {this.props.data}
                </Typography>
                <Typography variant="body2" component="p" color="textSecondary">
                  {this.props.unit}
                </Typography>
              </CardContent>
            </Card>
          );
    }
    
  
}

export default withStyles(styles)(DashboardCard);