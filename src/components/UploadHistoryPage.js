import React from 'react'
import Grid from '@material-ui/core/Grid';
import Uploader from './uploader'
import { withStyles } from '@material-ui/core/styles';
import instructions from '../Assets/instructions.gif'
import { Redirect } from "react-router";
import TextField from '@material-ui/core/TextField';
import fire from '../fire';
import CircularProgress from '@material-ui/core/CircularProgress';



const styles = {
    root: {
      minHeight:'100vh',
      width:'100%',
      flexGrow:1,
      padding: 30
      },
      sideMenu: {
        flexGrow:1,
        //borderRight: window.innerWidth > 600 ? '2px solid rgb(76, 159, 254)' : '0px',
        borderBottom: '2px solid rgb(76, 159, 254)'
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
          backgroundColor: '#HHHHHH'
      },
      image:{
          width:'90%'      },
        progress:{
            margin:2
        }
  };
  const CssTextField = withStyles({
    root: {
        margin:0,
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
            redirect: false,
            error: false,
            loading:false
        }
    }
    _handleNameChange = (event) =>{
        var value = event.target.value
        value = value.replace(/\s+/g, '')
        this.setState({name:value})
        if(value !== '') {
            this.setState({loading:true})
            fire.firestore().collection(value).get()
    .then(query => {
        console.log(query)
        console.log(query.query._query.path.segments[0])
        console.log(this.state.name)
        if(query.size === 0 ) {
            if(query.query._query.path.segments[0] === this.state.name) this.setState({error: false, loading:false})
        }
        else{
            if(query.query._query.path.segments[0] === this.state.name) this.setState({error: true, loading:false})
        }
    });
    }

        
      }
    render(){
        console.log(this.state.redirect)
        if( this.state.redirect === true){
            return (<Redirect to={'/'+this.state.name} />)
        }
      const { classes } = this.props;
      return(
        <Grid container className={classes.root} direction='column' justify='space-between' alignItems='stretch'>
    <Grid  style={{flexGrow:1}} container justify="space-between" alignItems="stretch" direction="row">
          <Grid item className={classes.sideMenu} xs={12} sm={6}>
            <Grid style={{ flexGrow:1}} container direction="column" justify="flex-start" alignItems="flex-start" >
                <h3 style={{color:'#4C9FFE'}}><span style={{color:'black'}}>1.</span> Download your Location History from Google. Here is an image to help how</h3>
                <a href="https://takeout.google.com/settings/takeout" target="_blank">Download here </a>
                <img className={classes.image} src={instructions} alt="instructions" />
            </Grid>
            </Grid>
            <Grid className={classes.sideMenu} item xs={12} sm={6}>
            <h3> 2. Name your Map</h3>
            <h5 style={{marginBottom: 0}}>This will create a unique link for WhereHaveYouBeenInTheWorld.com/YourMap</h5>
            <CssTextField id="custom-css-standard-input" required error={this.state.error} label="Name your map"
            helperText={this.state.error ? 'Name is already taken' : 'https://wherehaveIbeenintheworld.com/'+this.state.name}
        value={this.state.name}
        onChange={this._handleNameChange}
        margin="normal"
      />
      {this.state.loading && <CircularProgress className={classes.progress} />}

            <h3> 3. Unzip and Upload your data here</h3>
            <h5>(The file should look like LocationHistory.json)</h5>
            <Uploader name={this.state.name} onDataChange={d => this.setState({trips: d})} onDone={e => this.setState({activeStep:  this.state.activeStep + 1})}/>
            <h5>This may take a minute or two </h5>
            <h5>Don't worry we value your privacy and won't share this information with anyone. Also you can delete it anytime</h5>
            </Grid>
    </Grid>
    <Grid container className={classes.lastRow} justify="center" alignItems="center" direction="column">
    <div style={{margin:5}}>Any questions? Feel free to reach out to hi@wherehaveIbeenintheworld.com</div>
    <div style={{margin:5}}>If you like the map and want to show some love, you can show support by buying me a coffee</div>
    <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/pablito"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/BMC-btn-logo.svg" alt="Buy me a coffee"/><span style={{marginLeft: '5px'}}>Buy me a coffee</span></a>
    </Grid>
    </Grid>
      )}
  }

  export default withStyles(styles)(UploadHistoryPage);