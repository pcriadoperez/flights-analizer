import React from 'react'
import DashboardCard from './DashboardCard'
import Grid from '@material-ui/core/Grid';
import HorizontalSeries from './HorizontalSeries'
import { bboxes } from 'ngeohash';
import { ReactComponent as ClockIcon} from '../Assets/time.svg'
import { ReactComponent as Aeroplane} from '../Assets/aeroplane.svg';
import { ReactComponent as Co2} from '../Assets/co2-gas.svg'
import { ReactComponent as City} from  '../Assets/skyline.svg'
import { ReactComponent as World } from '../Assets/world.svg'
import { ReactComponent as CountriesIcon} from '../Assets/continents.svg'
import { ReactComponent as Trees} from '../Assets/forest.svg'
import { ReactComponent as Distance} from '../Assets/distance.svg'
import { ReactComponent as Favorite} from '../Assets/favorites.svg'
import { ReactComponent as Event } from '../Assets/event.svg'



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
        var countries = {}
        var km = 0
        var longestTrip = 0
        this.props.trips.forEach(function(trip){
            km += trip.distance
            if (trip.distance > longestTrip) {
              longestTrip= trip.distance
            }
            if(cities.hasOwnProperty(trip.from.city[0].region)) cities[trip.from.city[0].region] += 1
            else cities[trip.from.city[0].region] = 1
            if(countries.hasOwnProperty(trip.from.city[0].country)) countries[trip.from.city[0].country] += 1
            else countries[trip.from.city[0].country] = 1
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
            justify="center"
            alignItems="flex-start"
          >
            <DashboardCard icon={Aeroplane} title="Trips" data={this.props.trips.length} unit="trips" color='#4C9FFE'  />
            <DashboardCard icon={ClockIcon} title="First Trip: " data={timestampToDate(Number(this.props.trips[0].to.timestampMs))} />
          <DashboardCard icon={ClockIcon} title="Last Trip: " data= {timestampToDate(Number(this.props.trips[this.props.trips.length-1].to.timestampMs))} color='#1E3CA0'/>
        <DashboardCard icon={Co2} title="CO2: " data={Math.round(km*co2perkm/1000)} unit="tons" color='#FFCB23'>
        <a href='https://www.terrapass.com/product/productindividuals-families' >Offset your Carbon Footprint</a>
        </DashboardCard>
          <DashboardCard icon={Trees} title="Trees to plant: " data={Math.round(km*co2perkm/7.25748)} unit="Trees" />
          <DashboardCard icon={Distance} title="Distance: " data={Math.round(km)} unit="kms" color='#1E3CA0' />
          <DashboardCard icon={Distance}  title="Average trip: " data={Math.round(km/this.props.trips.length)} unit="kms" color='#FFCB23'/>
          <DashboardCard icon={Distance} title="Longest trip: " data={Math.round(longestTrip)} unit="kms" />
          <DashboardCard icon={World} title="Around the world: " data={Math.round(km/40074)} unit="times"  color='#4C9FFE'/>
          <DashboardCard title="You travel on average every " data={Math.round(averageTimeBetweenFlights)} unit="days" />
          {(Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights>0 ?
             <DashboardCard icon={Event} title="You normally would have taken a trip "data={Math.round((Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights)} unit="days ago"/>
            : <DashboardCard icon={Event} title="Your next trip is expected to be in "data={Math.round(-(Date.now()-Number(this.props.trips[this.props.trips.length-1].to.timestampMs))/86400000-averageTimeBetweenFlights)} unit="days"/>}
          <DashboardCard icon={CountriesIcon} title="Countries visited" data={Object.keys(countries).length} unit="countries"color='#FFCB23'/>
          <DashboardCard icon={City} title="Cities visited" data={Object.keys(cities).length} unit="cities"/>
          <DashboardCard icon={Favorite} title="Most visited" color='#4C9FFE' data={Object.keys(cities).reduce((a, b) => cities[a] > cities[b] ? a : b)} unit=""/>
          <HorizontalSeries title="Places visited" data={this.citiesArray.slice(-10)} />
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
