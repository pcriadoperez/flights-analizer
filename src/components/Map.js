import React from "react";
import DeckGL, { ArcLayer, ScatterplotLayer, FlyToInterpolator } from "deck.gl";
import MapGL, { StaticMap } from "react-map-gl";
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TimeChart from './TimeChart'
import 'react-sharingbuttons/dist/main.css'
import { Facebook, Twitter } from 'react-sharingbuttons'
import {  Redirect } from 'react-router'
import {ReactComponent as PlayButton} from '../Assets/play-button.svg'
import {ReactComponent as PauseButton} from '../Assets/pause.svg'
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import {easeCubic} from 'd3-ease';
import Dashboard, { timestampToDate} from './Dashboard'
import fire from "../fire";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicGNyaWFkb3AiLCJhIjoiY2p2cHBtNWt2MmNhbzRjb2l1cGtzYTQ1cCJ9.CNrvo_d0_vWXZJ0wM0w2gw";

const CustomSlider = withStyles({
  root: {
    color: "#4C9FFE",
    height: 6
  },
  thumb: {
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus,&:hover,&$active": {
      boxShadow: "inherit"
    }
  },
  track: {
    backgroundColor: "#4C9FFE",
    height: 6,
    borderRadius: 3
  }
})(Slider);
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  minZoom: 1,
  maxZoom: 16,
  pitch: 30,
  bearing: 0
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: true,
      viewport: {
        width: window.innerWidth - 20,
        height: window.innerHeight - 150,
        latitude: 0,
        longitude: 0,
        zoom: 1,
        pitch: 30,
        bearing: 0
      },
      loading: true,
      redirect: false,
      data: this.props.trips,
      sliderValue: Number(this.props.trips[0].from.timestampMs),
      filteredData: this.props.trips
    };
  }

  componentDidMount() {
    // Add listener to resize map onresize window
    window.addEventListener("resize", this._resize);
    this._resize();
    // Download data
    console.log(`Downloading map:${this.props.match.params.id}`);
    fire
      .firestore()
      .collection(this.props.match.params.id)
      .get()
      .then(snapshot => {
        const incomingData = [];
        snapshot.forEach(doc => {
          incomingData.push(doc.data());
          incomingData[incomingData.length - 1].from.date = incomingData[
            incomingData.length - 1
          ].from.date.toDate();
          incomingData[incomingData.length - 1].to.date = incomingData[
            incomingData.length - 1
          ].to.date.toDate();
        });
        console.log(incomingData);
        if (incomingData.length === 0) this.setState({ redirect: true });
        this.setState({
          data: incomingData,
          filteredData: incomingData,
          sliderValue: Number(incomingData[0].from.timestampMs),
          downloading: false
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }

  _resize = () => {
    this._onViewportChange({
      width: window.innerWidth - 20,
      height: window.innerHeight - 150
    });
  };

  delete;

  count = 0;

  _interpolate = (value, first, last) => {
    return ((value - first) / (last - first)) * 255;
  };

  _handleSliderChange = (event, value) => {
    if (event == "stop") {
      clearInterval(this.timer);
      delete this.timer;
    }
    this.setFilters(0, value);
    this.setState({ sliderValue: value });
  };

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}
        >
          <p>
{timestampToDate(hoveredObject.from.timestampMs)}
{' '}
 </p>
          <p>
km:{Math.round(hoveredObject.distance)}</p>
        </div>
      )
    );
  }

  _onViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _flyTo = (lat, long, pitch, zoom) => {
    this.setState({
      viewport: {
        width: window.innerWidth - 20,
        height: window.innerHeight - 150,
        longitude: long,
        latitude: lat,
        zoom,
        pitch,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
      }
    });
  };

  _handleClickDelete = e => {
    let deleteFn = fire.functions().httpsCallable("recursiveDelete");
    deleteFn({ path: this.props.match.params.id })
      .then(function(result) {
        console.log(`Delete success: ${  JSON.stringify(result)}`);
        this.setState({ redirect: true });
      })
      .catch(function(err) {
        console.log("Delete failed, see console,");
        console.warn(err);
        alert(
          "Ups, failed to delete, please try again or reach out to support"
        );
      });
  };

  _handlePlayClick = e => {
    const sliderRange =
      Number(this.state.data[this.state.data.length - 1].from.timestampMs) -
      Number(this.state.data[0].from.timestampMs);
    if (this.timer) {
      return this._handleSliderChange("stop", this.state.sliderValue);
    }
    this.timer = setInterval(() => {
      if (
        this.state.sliderValue <
        Number(this.state.data[this.state.data.length - 1].to.timestampMs)
      ) {
        if (this.state.filteredData.length > 0)
          this._flyTo(
            this.state.filteredData[this.state.filteredData.length - 1].from
              .latitudeE7 / 1e7,
            this.state.filteredData[this.state.filteredData.length - 1].from
              .longitudeE7 / 1e7,
            30,
            Math.max(
              1,
              Math.min(
                3,
                Math.round(
                  9000 /
                    this.state.filteredData[this.state.filteredData.length - 1]
                      .distance
                )
              )
            )
          );
        this._handleSliderChange(
          "play",
          this.state.sliderValue + Math.round(sliderRange / 200)
        );
      } else {
        this._handleSliderChange(
          "stop",
          this.state.sliderValue + Math.round(sliderRange / 200)
        );
        this._flyTo(0, 0, 30, 1);
      }
    }, 100);
  };

  filters = { minTime: -1, maxTime: Infinity };

  setFilters = function(minTime, maxTime) {
    this.filters.minTime = minTime;
    this.filters.maxTime = maxTime;
    let filteredData = this.state.data.filter(
      d =>
        Number(d.from.timestampMs) >= minTime &&
        Number(d.to.timestampMs) <= maxTime
    );
    if (filteredData.length === 0)
      filteredData = [
        {
          from: {
            accuracy: 0,
            altitude: 0,
            latitudeE7: 0,
            longitudeE7: 0,
            city: [
              {
                country: "Uruguay",
                country_code: "UY",
                region: "Uruguay",
                region_code: "XXX",
                city: "Montevideo"
              }
            ],
            timestampMs: "100"
          },
          to: {
            accuracy: 0,
            latitudeE7: 0,
            longitudeE7: 0,
            city: [
              {
                country: "Uruguay",
                country_code: "UY",
                region: "Uruguay",
                region_code: "XXX",
                city: "Montevideo"
              }
            ],
            timestampMs: "110"
          },
          distance: 1
        }
      ];
    this.setState({ filteredData });
    console.log(this.state.filteredData);
  };

  render() {
    const { viewport } = this.state;
    if (this.state.redirect) return <Redirect to="/" />;
    if (this.state.downloading) {
      return (
        <Grid
          container
          spacing={0}
              direction="column"
          alignItems="center"
              justify="center"
              style={{ minHeight: '100vh' }}
            > 
        >
          <img src={require("../Assets/dancing.gif")} alt="loading..." />
          <div>Downloading Data.. </div>
        </Grid>
      );
    }

    // console.log('ReRender Map')
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center">
              <div style={{backgroundColor:'white', width:this.state.viewport.width, height:this.state.viewport.height}} />
              <DeckGL
          height={this.state.viewport.height}
               viewState={this.state.viewport}
          controller
          initialViewState={INITIAL_VIEW_STATE}
               layers={[
            new ArcLayer({
              data: this.state.filteredData,
              strokeWidth: 900,
              getSourcePosition: d => [
                d.from.longitudeE7 / 1e7,
                d.from.latitudeE7 / 1e7
              ],
              getTargetPosition: d => [
                d.to.longitudeE7 / 1e7,
                d.to.latitudeE7 / 1e7
              ],
              getSourceColor: x => [
                0,
                255,
                this._interpolate(
                  Number(x.to.timestampMs),
                  Number(this.state.data[0].to.timestampMs),
                  Number(
                    this.state.data[this.state.data.length - 1].to.timestampMs
                  )
                )
              ],
              getTargetColor: x => [
                0,
                150,
                this._interpolate(
                  Number(x.to.timestampMs),
                  Number(this.state.data[0].to.timestampMs),
                  Number(
                    this.state.data[this.state.data.length - 1].to.timestampMs
                  )
                )
              ],
              pickable: true,
              // Update app state
              onHover: info =>
                this.setState({
                  hoveredObject: info.object,
                  pointerX: info.x,
                  pointerY: info.y
                }),
              autoHighlight: true
            }),
            new ScatterplotLayer({
              id: "locations",
              data: this.state.data,
              pickable: true,
              opacity: 0.8,
              filled: true,
              radiusScale: 50,
              radiusMinPixels: 1,
              radiusMaxPixels: 600,
              lineWidthMinPixels: 1,
              getPosition: d => [
                d.from.longitudeE7 / 1e7,
                d.from.latitudeE7 / 1e7
              ],
              getRadius: d => 600,
              getFillColor: d => [255, 140, 0],
              getLineColor: d => [0, 0, 0]
            })
          ]}>
               <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
               { this._renderTooltip() }
        </DeckGL>
              {this.state.data.length >0 && (
<div>
             <Grid container direction="row" justify="center" alignItems="center">
               {this.timer ? <PauseButton style={{width:50, height:50, fill:'#4C9FFE'}} onMouseEnter={e=> e.target.style.fill='#1E3CA0'} onMouseLeave={e=> e.target.style.fill='#4C9FFE'} onClick={this._handlePlayClick} />:
               <PlayButton style={{width:50, height:50, fill:'#4C9FFE'}} onMouseEnter={e=> e.target.style.fill='#1E3CA0'} onMouseLeave={e=> e.target.style.fill='#4C9FFE'} onClick={this._handlePlayClick} /> }
             <Grid>
             <TimeChart data={this.state.data} time={this.state.sliderValue}/>
             <Typography id="label">{timestampToDate(this.state.sliderValue)}</Typography>
              <CustomSlider
             value={this.state.sliderValue}
             min={Number(this.state.data[0].to.timestampMs)}
             max={Number(this.state.data[this.state.data.length-1].to.timestampMs)}
             aria-labelledby="label"
             onChange={this._handleSliderChange}
              />
             </Grid>
          </Grid>
           <Dashboard trips={this.state.filteredData} />
           <Grid container direction="row" justify="center" alignItems="center" >
            <h5> Share my map: </h5>
            <div>
            <Facebook url={window.location.href} />
            <Twitter url={window.location.href} shareText={'Check out my travels and create your own map at '+window.location.href} />
            <textarea>{"<iframe src='https://wherehaveIbeenintheworld.com/Pablo' style='border:0px #ffffff none;' name='Wherehaveibeen' scrolling='yes' frameborder='1' marginheight='0px' marginwidth='0px' height='400px' width='600px' allowfullscreen></iframe>"}</textarea>
            </div>
           </Grid>
           <Grid container direction="row" justify="center" alignItems="center" >
           <h5>Did you like this page?   </h5>
           <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/pablito"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/BMC-btn-logo.svg" alt="Buy me a coffee"/><span style={{marginLeft: '5px'}}>Buy me a coffee</span></a>
           </Grid>
           <Grid container direction="row" justify="center" alignItems="center" >
           <h5>
             Don't want this page anymore: <a href="/" onClick={this._handleClickDelete}> Delete this map</a>
           </h5>
             </Grid>
             <Grid container direction="row" justify="center" alignItems="center" >
           <h5>
             Feel free to reach out: hi@wherehaveibeenintheworld.com
           </h5>
             </Grid>

           </div>
)}
      </Grid>
    );
  }
}

Map.defaultProps = {
  trips: [
    {
      from: {
        accuracy: 69,
        altitude: 67,
        latitudeE7: 407365438,
        longitudeE7: -739958738,
        timestampMs: "1488871632000"
      },
      to: {
        accuracy: 2000,
        latitudeE7: 431236004,
        longitudeE7: -776659607,
        timestampMs: "1490302669609"
      }
    }
  ]
};

export default withRouter(Map);
