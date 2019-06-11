import React from 'react';
import Map from 


//import * as locationData from '../Assets/LocationHistory.json';
var oboe = require('oboe')

class DataLoader extends React.Component{
    constructor(props){
        super(props)
        state = {
            status: 'Loading'
        }
    }
    componentDidMount(){
        console.log('Component DID MOUNT!!') 
        oboe('/LocationHistory.json')
        .node('locations.*', function( location ){
        //console.log(location)
        if(location.hasOwnProperty("altitude")){
        if(location.altitude>5000) {
            this.count++
            console.log(this.count)
            backendLocations.push(location)
        }
        }
    return oboe.drop()
  })
   .done(function(things) {
    console.log('finished loading Stream')
   })
   .fail(function() {
      console.log('Location History Stream failed')
   });
 }    
    }
    render(){
        return <p>{this.state.status}</p>
    }
}

