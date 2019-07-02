import React from 'react'
import Grid from '@material-ui/core/Grid';
import Uploader from './uploader'
import { withStyles } from '@material-ui/core/styles';
import instructions from '../Assets/instructions.gif'
import { Redirect } from "react-router";
import TextField from '@material-ui/core/TextField';


const styles = {
    root: {
      height:'100%',
      width:'100%',
      flexGrow:1,
      padding: 30
      },
      sideMenu: {
          backgroundColor: 'white',
          color: 'black'   
        },
      video: {
        minWidth: '100%',
        minHeight: '100%',
        zIndex: -100,
        backgroundSize: 'cover',
        overflow: 'hidden'
      },
      createMyMap:{
        padding: '25px 50px 25px'
      },
      lastRow:{
          backgroundColor: '#FEFEFE'
      },
      image:{
          width:'90%'      }
  };
  const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
    },
  })(TextField);
class UploadHistoryPage extends React.Component {
    constructor(props){
        super(props)
        this.state={
            name:'',
            redirect: false
        }
    }
    _handleNameChange = (event) =>{
        this.setState({name: event.target.value})
      }
    render(){
        if( this.state.redirect) return (<Redirect to={'/map/'+this.state.name} />)
      const { classes } = this.props;
      return(
        <Grid container className={classes.root} direction='column' justify='space-between' alignItems='stretch'>
    <Grid  container justify="space-between" alignItems="stretch" direction="row">
          <Grid item className={classes.sideMenu} xs={12} sm={6}>
            <Grid style={{padding:10, fontColor:'black'}} container direction="column" justify="flex-start" alignItems="flex-start" >
                <h3 style={{color:'#4C9FFE'}}>1. Download your Location History from Google. Here is an image to help how</h3>
                <div style={{backgroundColor:'black', width:250, height: 4}}/>
                <a href="https://takeout.google.com/settings/takeout" target="_blank">Download from Google Takeoot </a>
                <img className={classes.image} src={instructions} alt="instructions" />
            </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
            <h3> 2. Name your Map</h3>
            <h5>This will create a unique link for WhereHaveYouBeenInTheWorld.com/YourMap</h5>
            <CssTextField id="custom-css-standard-input"  label="Name your map"
        value={this.state.name}
        onChange={this._handleNameChange}
        margin="normal"
      />
            <h3> 3. Upload your data here</h3>
            <Uploader name={this.state.name} onDataChange={d => this.setState({trips: d})} onDone={e => this.setState({activeStep:  this.state.activeStep + 1})}/>
            <h5>Don't worry we value your privacy and won't share this information with anyone. Also you can delete it anytime</h5>
            </Grid>
    </Grid>
    <Grid container className={classes.lastRow} justify="center" alignItems="flex-end" direction="row">
    <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/pablito"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/BMC-btn-logo.svg" alt="Buy me a coffee"/><span style={{marginLeft: '5px'}}>Buy me a coffee</span></a>
    </Grid>
    </Grid>
      )}
  }

  export default withStyles(styles)(UploadHistoryPage);