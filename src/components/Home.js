import React from 'react'
import Grid from '@material-ui/core/Grid';
import Uploader from './uploader'
import { withStyles } from '@material-ui/core/styles';
import instructions from '../Assets/instructions.gif'


const styles = {
    root: {
      height:'100%',
      width:'100%',
      flexGrow:1
      },
      sideMenu: {
          backgroundColor: 'tan'     
        },
      video: {
        minWidth: '100%',
        minHeight: '100%',
        width: '100%',
        height: '100%', 
        zIndex: -100,
        backgroundSize: 'cover',
        overflow: 'hidden'
      },
      image:{
          width:'90%'      }
  };

class Home extends React.Component {
    render(){
      const { classes } = this.props;
      return(
    <Grid container className={classes.root} justify="space-between" alignItems="stretch" direction="row">
            <Grid item xs={12} s={8} md={9} xl={10}>
            <video className={classes.video} muted={true} loop={true} autoPlay={true} src={require('../Assets/example.mp4')} type="video/mp4"></video>
            </Grid>
            <Grid item className={classes.sideMenu} xs={12} s={4} md={3} xl={2}>
            <Grid container direction="column" justify="center" alignItems="center" >
                <div> First click this link to download your Location History from Google </div>
                <a href="https://takeout.google.com/settings/takeout" target="_blank">Download from Google Takeoot </a>
                <img className={classes.image} src={instructions} alt="instructions" />
                <div> Don't worry we value your privacy and won't share this information with anyone </div>
                <Uploader onDataChange={d => this.setState({trips: d})} onDone={e => this.setState({activeStep:  this.state.activeStep + 1})}/>
            </Grid>
            </Grid>
    </Grid>
      )}
  }

  export default withStyles(styles)(Home);