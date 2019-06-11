import React from 'react'
import DashboardCard from './DashboardCard'
import Grid from '@material-ui/core/Grid';
import HorizontalSeries from './HorizontalSeries'
import { bboxes } from 'ngeohash';


const co2perkm = 0.189655172

export function timestampToDate(timestamp){
    var date
    if(typeof timestamp != 'number') date = new Date(Number(timestamp))
    else date = new Date(timestamp)
    return date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

export function tripDistance(trip){
    return latLongToDistance(trip.from.latitudeE7/1e7, trip.from.longitudeE7/1e7, trip.to.latitudeE7/1e7, trip.to.longitudeE7/1e7)
}
 // https://www.geodatasource.com/developers/javascript
export function latLongToDistance(lat1, lon1, lat2, lon2){
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344
      return dist;
    }
  }

  
class Dashboard extends React.Component{
    render(){
        var cities = {}
        var km = 0
        this.props.trips.forEach(function(trip){
            km += trip.distance
            if(cities.hasOwnProperty(trip.from.city[0].region)) cities[trip.from.city[0].region] += 1
            else cities[trip.from.city[0].region] = 1
        })
        this.citiesArray =[]
        for (let [k, v] of Object.entries(cities)){
          this.citiesArray.push({y:k, x:v})
        }
        this.citiesArray.sort(function(a, b) {
          return a.x - b.x;
        });
      console.log(this.citiesArray)
        var averageTimeBetweenFlights = ((Number(this.props.trips[this.props.trips.length-1].to.timestampMs) - Number(this.props.trips[0].from.timestampMs))/86400000)/this.props.trips.length //In days
        return(
            <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <DashboardCard title="Trips" data={this.props.trips.length} unit="trips" />
          <DashboardCard title="First Trip: " data={timestampToDate(Number(this.props.trips[0].to.timestampMs))} />
          <DashboardCard title="Last Trip: " data= {timestampToDate(Number(this.props.trips[this.props.trips.length-1].to.timestampMs))}/>
          <DashboardCard title="CO2: " data={Math.round(km*co2perkm/1000)} unit="tons"/>
          <DashboardCard title="Trees to plant: " data={Math.round(km*co2perkm/7.25748)} unit="Trees" />
          <DashboardCard title="Distance: " data={Math.round(km)} unit="kms" />
          <DashboardCard title="Average trip: " data={Math.round(km/this.props.trips.length)} unit="kms" />
          <DashboardCard title="Around the world: " data={Math.round(km/40074)} unit="times" />
          <DashboardCard title="You travel on average every " data={Math.round(averageTimeBetweenFlights)} unit="days" />
          {(Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights>0 ?
             <DashboardCard title="You normally would have taken a trip "data={Math.round((Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights)} unit="days ago"/>
            : <DashboardCard title="Your next trip is expected to be in "data={Math.round(-(Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights)} unit="days"/>}
          <DashboardCard title="Most visited" data={Object.keys(cities).reduce((a, b) => cities[a] > cities[b] ? a : b)} unit="" />
          <HorizontalSeries title="Places visited" data={this.citiesArray} />
          </Grid>
          
        )}
}

Dashboard.defaultProps = {
  trips:[{
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
          timestampMs: "110",
          city:[{country: "Uruguay", country_code: "UY", region: "Uruguay", region_code: "XXX", city: "Montevideo"}],
        },
    distance: 1
  }]
}

export default Dashboard;
