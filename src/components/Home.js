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
          backgroundColor: '#4C9FFE',
          color: 'white'   
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
            <Grid style={{padding:10, fontColor:'white'}} container direction="column" justify="center" alignItems="center" >
                <h1>Create a map using your Google Location </h1>
                <h3> First click this link to download your Location History from Google. Here is an image to help you how </h3>
                <a href="https://takeout.google.com/settings/takeout" target="_blank">Download from Google Takeoot </a>
                <img className={classes.image} src={instructions} alt="instructions" />
                <h3> Then upload your data here. Don't worry we value your privacy and won't share this information with anyone and you can delete it anytime</h3>
                <Uploader onDataChange={d => this.setState({trips: d})} onDone={e => this.setState({activeStep:  this.state.activeStep + 1})}/>
                <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/pablito"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/BMC-btn-logo.svg" alt="Buy me a coffee"/><span style={{marginLeft: '5px'}}>Buy me a coffee</span></a>
            </Grid>
            </Grid>
    </Grid>
      )}
  }

  export default withStyles(styles)(Home);