import React from 'react'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router";
import { ReactComponent as Trees} from '../Assets/forest.svg'
import DashboardCard from './DashboardCard'



const styles = {
    root: {
      flexGrow:1,
      minHeight: '100vh'
      },
      sideMenu: {
          padding: 10,
          backgroundColor: 'white',
          color: 'black'   
        },
      video: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'auto',
        minWidth: '100%',
        height: 'auto',
        minHeight: '100%',
        transform: 'translateX(-50%) translateY(-50%)',
        zIndex: -100
      },
      createMyMap:{
        width: '80%',
        textAlign: 'center',
        padding: '15px',
        margin: 15,
        backgroundColor: '#4C9FFE',
        color:'white',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: "#1E3CA0",
       },
      },
      image:{
          width:'90%'      },
      videoWrapper:{
        position: 'relative',
        overflow: 'hidden',
        minWidth: '100%',
        minHeight: '500px',
        height: '100%'
      }
  };

class Home extends React.Component {
    constructor(props){
      super(props)
      this.state={
        redirect:false
      }
    }
    render(){
      if(this.state.redirect) return <Redirect to='/menu/upload' />
      const { classes } = this.props;
      return(
      <Grid container className={classes.root} justify="center" alignItems="stretch" direction="row" >
          <Grid item className={classes.sideMenu} xs={12} sm={6}> 
                <h1>Create a map using your Google Location </h1>
                <div style={{backgroundColor:'black', width:250, height: 4, margin:5}}/>
                <div className={classes.createMyMap}  onClick={()=>this.setState({redirect: true})}>Create My Map</div>
                <h3> See your average distance, longest trip, how much CO2 you consumed, number of countries visited and more...</h3>
                <DashboardCard icon={Trees} title="Trees to plant: " data={25372} unit="Trees" />
            </Grid>
            <Grid item xs={12} sm={6} >
            <div className={classes.videoWrapper}>
              <video className={classes.video} muted={true} loop={true} autoPlay={true} src={require('../Assets/example.mp4')} type="video/mp4"></video>
            </div>
            </Grid>
    </Grid>
      )}
  }

  export default withStyles(styles)(Home);