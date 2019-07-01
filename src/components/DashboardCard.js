import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles  ={
    card: {
      width: 275,
      padding: 10,
      height: 275
        },
    title: {
      fontSize: 60,
    },
    pos: {
      margin: 12,
    },
  }

class DashboardCard extends React.Component{
    render(){
        var { classes } = this.props;
        const Icon = this.props.icon
        return (
            <Card className={classes.card} style={{backgroundColor: this.props.color, width: this.props.width ? this.props.width :classes.card.width }}>
              <CardContent>
                {this.props.icon && <Icon style={{width:100, height:100, fill:this.props.color ? 'white' : 'black'}} />}
                <Typography variant="h5" component="h2" style={{color: this.props.color ? 'white' : 'black'}}>
                  {this.props.title}
                </Typography>
                <Typography variant="h3" component="p" style={{color: this.props.color ? 'white' : 'black'}}>
                  {this.props.data}
                </Typography>
                <Typography variant="h3" component="p" color="textSecondary" style={{color: this.props.color ? 'white' : 'black'}}>
                  {this.props.unit}
                </Typography>
                {this.props.children}
              </CardContent>
            </Card>
          );
    }
    
  
}

export default withStyles(styles)(DashboardCard);