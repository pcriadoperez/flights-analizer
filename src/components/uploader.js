import React from 'react';
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import fire from '../fire';
import DropzoneComponent from 'react-dropzone-component';
import ReactDOMServer from 'react-dom/server';
import LinearProgress from '@material-ui/core/LinearProgress';
import  {tripDistance, timestampToDate} from './Dashboard'

var crg = require('city-reverse-geocoder');
var tzlookup = require("tz-lookup");
var tzOffset = require("tz-offset")





var self

var componentConfig = {
  iconFiletypes: ['.json'],
  showFiletypeIcon: true,
  postUrl: '/'
  
};



const prettySize = require('prettysize')

var reader = new FileReader()


function tripSpeed(trip){
  return(trip.distance / ((trip.to.date - trip.from.date )/3600000))
}


var oboe = require('oboe')
let oboejs = new oboe()
var updatedArcs = []
oboejs.node('locations.*', function( location ){
  if(!location.hasOwnProperty('latitudeE7' ) || !location.hasOwnProperty('longitudeE7')) return oboe.drop()
  if(!(location.latitudeE7 >= -900000000 && location.latitudeE7 <= 900000000 && location.longitudeE7 >= -1800000000 && location.longitudeE7 <= 1800000000)) {console.log(location); return oboe.drop()}
  if(location.latitudeE7 === 0 && location.longitudeE7 === 0 ) return oboe.drop()
  location.date = tzOffset.timeAt(new Date(Number(location.timestampMs)), tzlookup(location.latitudeE7 /1e7, location.longitudeE7 /1e7))
  if(updatedArcs.length === 0 ) updatedArcs.push({"from": location, "to": location})
  if(Math.abs(location.latitudeE7 - updatedArcs[updatedArcs.length-1].to.latitudeE7) + Math.abs(location.longitudeE7 - updatedArcs[updatedArcs.length-1].to.longitudeE7) > 3e7){ //Check distance is larger than ~200km
    if(location.timestampMs - updatedArcs[updatedArcs.length-1].to.timestampMs <900000 ) return oboe.drop() //15min change
    if(location.date < updatedArcs[updatedArcs.length-1].to.date) return oboe.drop() // check for out of order // Doesnt'take into daylight time changes
    updatedArcs.push({"from": updatedArcs[updatedArcs.length-1].to, "to": location})
    updatedArcs[updatedArcs.length-1].from.city = crg(updatedArcs[updatedArcs.length-1].from.latitudeE7/1e7 , updatedArcs[updatedArcs.length-1].from.longitudeE7/1e7 )
    updatedArcs[updatedArcs.length-1].to.city = crg(updatedArcs[updatedArcs.length-1].to.latitudeE7/1e7 , updatedArcs[updatedArcs.length-1].to.longitudeE7/1e7 )
    updatedArcs[updatedArcs.length -1].distance = tripDistance(updatedArcs[updatedArcs.length -1])
    updatedArcs[updatedArcs.length-1].speed = tripSpeed(updatedArcs[updatedArcs.length-1])
    if(updatedArcs[updatedArcs.length-1].speed >2200) updatedArcs.pop()
  }
return oboe.drop()
})
.done(function(things) {
  console.log('finished loading Stream')
  updatedArcs.shift()
  console.log(updatedArcs)
  self.props.onDataChange(updatedArcs)
})
.fail(function() {
  console.log('Location History Stream failed')
});

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      display: 'none',
    },
  });
  
  function parseJSONFile ( file, oboeInstance ) {
    var fileSize = file.size;
    var prettyFileSize = prettySize(fileSize);
    var chunkSize = 512 * 1024; // bytes
    var offset = 0;
    //var self = this; // we need a reference to the current object
    var chunkReaderBlock = null;
    var startTime = Date.now();
    var endTime = Date.now();
    var readEventHandler = function ( evt ) {
      if ( evt.target.error == null ) {
        offset += evt.target.result.length;
        var chunk = evt.target.result;
        var percentLoaded = ( 100 * offset / fileSize ).toFixed( 0 );
        console.log( percentLoaded + '% of ' + prettyFileSize + ' loaded...' );
        self.setState({percentLoaded: percentLoaded})
        oboeInstance.emit( 'data', chunk ); // callback for handling read chunk
      } else {
        return;
      }
      if ( offset >= fileSize ) {
        oboeInstance.emit( 'done' );
        return;
      }

      // of to the next chunk
      chunkReaderBlock( offset, chunkSize, file );
    }

    chunkReaderBlock = function ( _offset, length, _file ) {
      var r = new FileReader();
      var blob = _file.slice( _offset, length + _offset );
      r.onload = readEventHandler;
      r.readAsText( blob );
    }

    // now let's start the read with the first block
    chunkReaderBlock( offset, chunkSize, file );
  }
  class Uploader extends React.Component {
   
    djsConfig = {
      maxFilesize:1000,
      accept: function ( file, done ) {
        parseJSONFile(file , oboejs )
      },
      previewTemplate: ReactDOMServer.renderToStaticMarkup(
        <div className="dz-preview dz-file-preview">
          <div className="dz-details">
          </div>
          <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress="true"></span></div>
        </div>
      )
    }
    constructor(props) {
      super(props);
      self=this
      this.fileInput = React.createRef();
      this.state={
        percentLoaded: 0,
        fullname: '',
        files: [],
        data:undefined
      }
    }
    eventHandlers = {
      // This one receives the dropzone object as the first parameter
      // and can be used to additional work with the dropzone.js
      // object
      init: null,
      // All of these receive the event as first parameter:
      drop: null,
      dragstart: null,
      dragend: null,
      dragenter: null,
      dragover: null,
      dragleave: null,
      // All of these receive the file as first parameter:
      addedfile: null,
      removedfile: null,
      thumbnail: null,
      error: null,
      processing: null,
      uploadprogress: null,
      sending: null,
      success: null,
      complete: null,
      canceled: null,
      maxfilesreached: null,
      maxfilesexceeded: null,
      // Special Events
      totaluploadprogress: null,
      reset: null,
      queuecomplete: null
    }
    _updateInput = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    handleClose() {
      this.setState({
          open: false
      });
      console.log(this.state.files[0])
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        console.log(typeof(this.stae.files[0]))
    }
      reader.readAsBinaryString(this.state.files[0])
  }
  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({
        files: files, 
        open: false
    });
}      
      render(){
        this.eventHandlers.complete = this.props.onDone
        return (
      <div>
        
         {(this.state.percentLoaded != 100 && this.state.percentLoaded != 0) ?
          <LinearProgress variant="determinate" value={this.state.percentLoaded }/> :<div>
          <DropzoneComponent config={componentConfig}
          eventHandlers={this.eventHandlers} djsConfig={this.djsConfig} 
           /></div>}               
         
      </div>
        )}
    
  }
  
  
  export default withStyles(styles)(Uploader);