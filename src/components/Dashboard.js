/* eslint-disable react/destructuring-assignment */
import React from "react";
import Grid from "@material-ui/core/Grid";
import DashboardCard from "./DashboardCard";
import HorizontalSeries from "./HorizontalSeries";
import { ReactComponent as ClockIcon } from "../Assets/time.svg";
import { ReactComponent as Aeroplane } from "../Assets/aeroplane.svg";
import { ReactComponent as Co2 } from "../Assets/co2-gas.svg";
import { ReactComponent as City } from "../Assets/skyline.svg";
import { ReactComponent as World } from "../Assets/world.svg";
import { ReactComponent as CountriesIcon } from "../Assets/continents.svg";
import { ReactComponent as Trees } from "../Assets/forest.svg";
import { ReactComponent as Distance } from "../Assets/distance.svg";
import { ReactComponent as Favorite } from "../Assets/favorites.svg";
import { ReactComponent as Event } from "../Assets/event.svg";

const co2perkm = 0.00012; // 10^3kg of CO2/km
const treesperco2 = 15;
const kmpermovie = 1500; // Assumes 500km/h and 1.5h per movie
const colors = {
  time: ["#3023ae", "#c86dd7"],
  time2: ["#36c36c", "#36c36c"],
  distance: ["#aaa", "#ccc"],
  sustainability: ["#36c36c", "#36c36c"],
  geography: ["#3023ae", "#c86dd7"]
};

export function timestampToDate(timestamp) {
  let date;
  if (typeof timestamp !== "number") date = new Date(Number(timestamp));
  else date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function tripDistance(trip) {
  return latLongToDistance(
    trip.from.latitudeE7 / 1e7,
    trip.from.longitudeE7 / 1e7,
    trip.to.latitudeE7 / 1e7,
    trip.to.longitudeE7 / 1e7
  );
}
// https://www.geodatasource.com/developers/javascript
export function latLongToDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  }

  let radlat1 = (Math.PI * lat1) / 180;
  let radlat2 = (Math.PI * lat2) / 180;
  let theta = lon1 - lon2;
  let radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return dist;
}

class Dashboard extends React.Component {
  render() {
    const cities = {};
    const countries = {};
    let km = 0;
    let longestTrip = 0;
    const legCounter = {};
    this.props.trips.forEach(function(trip) {
      km += trip.distance;
      if (trip.distance > longestTrip) {
        longestTrip = trip.distance;
      }
      // Count legs
      if (
        legCounter.hasOwnProperty(
          `${trip.from.city[0].region} - ${trip.to.city[0].region}`
        )
      )
        legCounter[
          `${trip.from.city[0].region} - ${trip.to.city[0].region}`
        ] += 1;
      else
        legCounter[
          `${trip.from.city[0].region} - ${trip.to.city[0].region}`
        ] = 1;
      // Count cities
      if (cities.hasOwnProperty(trip.from.city[0].region))
        cities[trip.from.city[0].region] += 1;
      else cities[trip.from.city[0].region] = 1;
      if (countries.hasOwnProperty(trip.from.city[0].country))
        countries[trip.from.city[0].country] += 1;
      else countries[trip.from.city[0].country] = 1;
    });
    this.citiesArray = [];
    for (const [k, v] of Object.entries(cities)) {
      this.citiesArray.push({ y: k, x: v });
    }
    this.citiesArray.sort(function(a, b) {
      return a.x - b.x;
    });
    // console.log(this.citiesArray)
    const averageTimeBetweenFlights =
      (Number(this.props.trips[this.props.trips.length - 1].to.timestampMs) -
        Number(this.props.trips[0].from.timestampMs)) /
      86400000 /
      this.props.trips.length; // In days
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        style={{backgroundColor: "#e9e9e9"}}
      >
        <Grid
          className="dashboard-group"
          direction='column'
          container
          justify="center"
          alignItems="center"
        >
        <Grid container direction='row' justify="center" alignItems="stretch" >
          <Grid item xs={6} sm={3} md={2}>
            <DashboardCard 
              icon={ClockIcon}
              title="First Trip"
              data={timestampToDate(Number(this.props.trips[0].to.timestampMs))}
              color={colors.time} unit=''
            />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <DashboardCard
              icon={ClockIcon}
              title="Last Trip"
              data={timestampToDate(
                Number(
                  this.props.trips[this.props.trips.length - 1].to.timestampMs
                )
              )}
              color={colors.time} unit=''
            />
            </Grid>
            </Grid>
          <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item xs={6} sm={3} md={2}>
                <DashboardCard
                color={colors.time}
                icon={Aeroplane}
                title="Trips"
                data={this.props.trips.length}
                unit="trips"
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <DashboardCard color={[ "#fff", "#fff"]}>
              <h1 style={{color:'dark-gray'}}>Time is precious</h1>
              <div style={{color:'dark-gray'}}>
                Based on your Google Location record, We will calculate your
                average distance, longest trip, how many CO2 you consumed, how
                many trees to plant, and more…
              </div>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
            <Grid container direction='row' justify="space-between" alignItems="stetch" style={{height:'100%'}}>
              <Grid item xs={6} sm={12}>
            <DashboardCard
              color={colors.time}
              title="You travel on average every"
              data={Math.round(averageTimeBetweenFlights)}
              unit="days"
            /></Grid>
            <Grid item xs={6} sm={12}>
            {(Date.now() -
              Number(
                this.props.trips[this.props.trips.length - 1].to.timestampMs
              )) /
              86400000 -
              averageTimeBetweenFlights >
            0 ? (
              <DashboardCard
                color={colors.time}
                icon={Event}
                title="You normally would have taken a trip"
                data={Math.round(
                  (Date.now() -
                    Number(
                      this.props.trips[this.props.trips.length - 1].to
                        .timestampMs
                    )) /
                    86400000 -
                    averageTimeBetweenFlights
                )}
                unit="days ago"
              />
            ) : (
              <DashboardCard
                color={colors.time}
                icon={Event}
                title="Your next trip is expected to be in"
                data={Math.round(
                  -(
                    Date.now() -
                    Number(
                      this.props.trips[this.props.trips.length - 1].to
                        .timestampMs
                    )
                  ) /
                    86400000 -
                    averageTimeBetweenFlights
                )}
                unit="days"
              />
            )}
            </Grid>
            </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <HorizontalSeries color={colors.time} width={this.props.width}
              title="Places visited"
              data={this.citiesArray.slice(-10)}
            />
             </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className="dashboard-group"
        >
          <Grid container direction="row" justify="center" alignItems="stretch">
            <Grid item xs={6} sm={3} md={2} />
            <Grid item xs={6} sm={3} md={2}>
            <DashboardCard
              color={colors.distance}
              icon={Distance}
              title="Distance"
              data={Math.round(km)}
              unit="kms"
            />
            </Grid>
            <Grid item xs={6} sm={3} md={2} />
            <Grid item xs={6} sm={3} md={2}>
            <DashboardCard
              color={colors.distance}
              icon={Distance}
              title="Average trip"
              data={Math.round(km / this.props.trips.length)}
              unit="kms"
            />
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6} sm={3} md={2}>
            <DashboardCard
              color={colors.distance}
              icon={Distance}
              title="Longest trip"
              data={Math.round(longestTrip)}
              unit="kms"
            />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <h2>General Overview</h2>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <DashboardCard
              color={colors.distance}
              icon={World}
              title="Around the world"
              data={Math.round(km / 40074)}
              unit="times"
            />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <DashboardCard color={["#fff", "#fff"]}>
              <div>
                Based on your Google Location record, We will calculate your
                average distance, longest trip, how many CO.`
              </div>
            </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className="dashboard-group"
        >
        <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs={6} sm={3} md={2}>
        <h2>Where have I been</h2>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
        <div>asdlkfjsa;ldkfj sldkfjsd;lkfjasdlkjf  sndflkjsdalfkjsad</div>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DashboardCard
            color={colors.geography}
            icon={CountriesIcon}
            title="Countries visited"
            data={Object.keys(countries).length}
            unit="countries"
          />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
          <DashboardCard
            color={colors.geography}
            icon={City}
            title="Cities visited"
            data={Object.keys(cities).length}
            unit="cities"
          />
          </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item xs={6} sm={3} md={2}>
          <DashboardCard
            color={colors.geography}
            icon={Favorite}
            title="Most visited"
            data={Object.keys(cities).reduce((a, b) =>
              cities[a] > cities[b] ? a : b
            )}
            unit="times"
          />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
          <DashboardCard
            color={colors.geography}
            icon={Favorite}
            title="Most travelled"
            data={Object.keys(legCounter).reduce((a, b) =>
              legCounter[a] > legCounter[b] ? a : b
            )}
            unit="times"
          />
          </Grid>
          <Grid item xs={6} sm={3} md={2}></Grid>
          <Grid item xs={6} sm={3} md={2}></Grid>
          </Grid>
        </Grid>
        <Grid
          className="dashboard-group"
          container
          justify="center"
          alignItems="stretch"
        >
        <Grid container direction='row' justify='center' alignItems='stretch'>
        <Grid item xs={6} sm={3} md={2}>
        <DashboardCard
          color={colors.time2}
          icon={ClockIcon}
          title="Possible New Friends"
          data={Math.round(km / kmpermovie)}
          unit="friends"
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <h2>Time Travelling</h2>
        <div> asd;klfjasdkl;fja;sdlkf</div>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
        <DashboardCard
          color={colors.time2}
          icon={ClockIcon}
          title="Books"
          data={Math.round(km / kmpermovie)}
          unit="books"
        />
        </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='stretch'>
        <Grid xs={6} sm={3} md={2}>
        <DashboardCard
          color={colors.time2}
          icon={ClockIcon}
          title="Movies"
          data={Math.round(km / kmpermovie)}
          unit="movies"
        />
        </Grid>
        <Grid xs={6} sm={3} md={2}>
        <DashboardCard
          color={colors.time2}
          icon={ClockIcon}
          title="Days"
          data={Math.round(km / kmpermovie)}
          unit="days"
        />
        </Grid>
        </Grid>
        </Grid>
        <Grid
          container
          className="dashboard-group"
          direction="row"
          justify="center"
          alignItems="stretch"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="stretch"
            >
              <Grid item xs={6} />
              <Grid item xs={6}>
              <DashboardCard
                color={colors.sustainability}
                icon={Co2}
                title="CO2"
                data={Math.round(km * co2perkm)}
                unit="Tonnes"
              >
                <a href="https://www.terrapass.com/product/productindividuals-families">
                  Offset your Carbon Footprint
                </a>
              </DashboardCard>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="stretch"
            >
            <Grid item xs={6}>
              <DashboardCard
                color={colors.sustainability}
                icon={Trees}
                title="Trees to plant"
                data={Math.round(km * co2perkm * treesperco2)}
                unit="Trees"
              >
                <a href="https://onetreeplanted.org/">Plant Trees</a>
              </DashboardCard>
              </Grid>
              <Grid xs={6}/>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <h2>Sustainability</h2>
            <div> balabalbalbalba </div>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Dashboard.defaultProps = {
  trips: [
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
        timestampMs: "110",
        city: [
          {
            country: "Uruguay",
            country_code: "UY",
            region: "Uruguay",
            region_code: "XXX",
            city: "Montevideo"
          }
        ]
      },
      distance: 1
    }
  ]
};

export default Dashboard;
