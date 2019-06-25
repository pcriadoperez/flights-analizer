import React from 'react';
import DeckGL, {ArcLayer, ScatterplotLayer, FlyToInterpolator} from 'deck.gl';
import MapGL from 'react-map-gl';
import fire from '../fire';
import Dashboard, {tripDistance, timestampToDate} from './Dashboard'
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab';
import { PlayCircleFilled } from '@material-ui/icons';
import TimeChart from './TimeChart'





var name = 'Pablo'

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGNyaWFkb3AiLCJhIjoiY2p2cHBtNWt2MmNhbzRjb2l1cGtzYTQ1cCJ9.CNrvo_d0_vWXZJ0wM0w2gw';

// Initial viewport settings
const initialViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  pitch: 0,
  bearing: 0
};



class Map extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      viewport: {
        width: '100%',
        height: 600,
        latitude: 0,
        longitude: 0,
        zoom: 1,
        pitch: 30
      },
      loading : true,
      sliderValue: Number(this.props.trips[0].from.timestampMs),
      filteredData: this.props.trips
    };
  }
  count = 0
  _handleSliderChange= (event, value) => {
    if(event == "stop"){
      clearInterval(this.timer)
      delete this.timer
    }
    this.setFilters(0,value)
    this.setState({sliderValue: value });
  };
  _renderTooltip(){
    const {hoveredObject, pointerX, pointerY} = this.state || {};
    return hoveredObject && (
      <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
        <p>Time: { timestampToDate(hoveredObject.from.timestampMs)} </p>
        <p>km: { Math.round(hoveredObject.distance )}</p>
      </div>
    );
  }  
      _onViewportChange = viewport => {
        this.setState({viewport});
      }
      _flyTo = (lat,long) => {
        this.setState({
          viewState: {
            ...this.state.viewState,
            longitude: long,
            latitude: lat,
            zoom: 14,
            pitch: 0,
            bearing: 0,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator()
          }
        });
      }
      _handlePlayClick = (e)=> {
        if(this.timer) {
          return this._handleSliderChange('stop', this.state.sliderValue)
        }
        this.timer = setInterval(() => {
          if(this.state.sliderValue<Number(this.props.trips[this.props.trips.length-1].to.timestampMs)){
            //if(this.state.filteredData.length>0) this._flyTo(this.state.filteredData[this.state.filteredData.length-1].from.latitudeE7/1e7, this.state.filteredData[this.state.filteredData.length-1].from.longitudeE7/1e7)
            this._handleSliderChange('play', this.state.sliderValue + 200000000)
          }
          else{
            this._handleSliderChange('stop', this.state.sliderValue + 200000000)
          }
      }, 100)
      }

      filters = {minTime: -1, maxTime: Infinity};

      setFilters = function(minTime, maxTime) {
        this.filters.minTime = minTime;
        this.filters.maxTime = maxTime;
        let filteredData = this.props.trips.filter(d => Number(d.from.timestampMs) >= minTime && Number(d.to.timestampMs) <= maxTime)
        if(filteredData.length === 0) filteredData = [{
          from:{accuracy: 0,
            altitude: 0,
            latitudeE7: 0,
            longitudeE7: 0,
            city:[{country: "Uruguay", country_code: "UY", region: "Uruguay", region_code: "XXX", city: "Montevideo"}],
            timestampMs: "100"},
          to: {
              accuracy: 0,
                latitudeE7: 0,
                longitudeE7: 0,
                city:[{country: "Uruguay", country_code: "UY", region: "Uruguay", region_code: "XXX", city: "Montevideo"}],
                timestampMs: "110"
              },
          distance: 1
        }]
        this.setState({filteredData: filteredData})
        console.log(this.state.filteredData)
      }
      render() {
        const {viewport} = this.state;
        return (
          <div>
          <MapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            {...viewport}
            onViewportChange={(viewport) => this.setState({viewport})}
          >
          <DeckGL
          controller={true}
          viewState={viewport}
          layers={[
            new ArcLayer({
              data: this.state.filteredData,
              strokeWidth: 900,
              getSourcePosition: d =>[d.from.longitudeE7/ 1e7, d.from.latitudeE7/1e7],
              getTargetPosition: d =>[d.to.longitudeE7/ 1e7, d.to.latitudeE7/1e7],
              getSourceColor: x => [0, 0, 255],
              getTargetColor: x => [0, 255, 0],
              pickable: true,
              // Update app state
              onHover: info => this.setState({
                hoveredObject: info.object,
                pointerX: info.x,
                pointerY: info.y
              }),
              autoHighlight: true
            }),
            new ScatterplotLayer({
              id: "locations",
              data: this.props.trips,
              pickable: true,
              opacity: 0.8,
              filled: true,
              radiusScale: 50,
              radiusMinPixels: 1,
              radiusMaxPixels: 600,
              lineWidthMinPixels: 1,
              getPosition: d => ([d.from.longitudeE7/ 1e7, d.from.latitudeE7/1e7]),
              getRadius: d => 600,
              getFillColor: d => [255, 140, 0],
              getLineColor: d => [0, 0, 0]})
          ]}
        >
         { this._renderTooltip() }
        <ScatterplotLayer id='scatterplot-layer' pickable={true}
    opacity={0.8}
    filled={true}
    radiusScale={6}
    radiusMinPixels={1}
    radiusMaxPixels={100}
    lineWidthMinPixel={1}
    getPosition={d => [0,0]}
    getRadius={d => Math.sqrt(d.exits)}
    getFillColor={d => [255, 140, 0]}
    getLineColor={d => [0, 0, 0]} />
        </DeckGL>
        </MapGL>
        {this.props.trips.length >0 &&
        <div>
          <TimeChart data={this.props.trips} time={this.state.sliderValue}/>
          <Typography id="label">{timestampToDate(this.state.sliderValue)}</Typography>
          <Fab color="primary" aria-label="Add" onClick={this._handlePlayClick}>
            <PlayCircleFilled />
          </Fab>
        <Slider
          value={this.state.sliderValue}
          min={Number(this.props.trips[0].from.timestampMs)}
          max={Number(this.props.trips[this.props.trips.length-1].from.timestampMs)}
          aria-labelledby="label"
          onChange={this._handleSliderChange}
        />
        <Dashboard trips={this.state.filteredData} />
        </div>
          }
        
        </div>
          )    
      }
}

Map.defaultProps = {
  trips:[{
    from:{accuracy: 69,
      altitude: 67,
      latitudeE7: 407365438,
      longitudeE7: -739958738,
      timestampMs: "1488871632000"},
    to: {
        accuracy: 2000,
          latitudeE7: 431236004,
          longitudeE7: -776659607,
          timestampMs: "1490302669609"
        }
  }]
}

  
export default Map