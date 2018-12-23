import React, { Component } from "react";
import ListDisplay from "./ListDisplay.js";
import MapDisplay from "./MapDisplay.js";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Geocode from "react-geocode";

const GOOGLE_APIKEY = "AIzaSyCw39CndLvjlQUrWXPKX-mZa00g4Gc9p2M";
const CLIENT_DATA_PATH = "./data/clients.json";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  clientsData: {
    justifyContent: "left",
    paddingBottom: "20px",
    marginTop: "75px",
    marginBottom: "75px",
    marginLeft: "100px",
    marginRight: "100px",
    height: "500px",
    maxHeight: "400px",
    maxWidth: "1200px",
    boxShadow: "0px 0px 10px rgba(50, 50, 50, 0.75)",
    borderRadius: "10px"
  },
  dataWrapper: {
    paddingBottom: "5px"
  },
  titleBox: {
    paddingLeft: "10px",
    fontSize: "x-large"
  },
  titleText: {
    borderBottomColor: "#808993",
    fontSize: "x-large"
  }
});

class ClientsData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: {},
      countries: [],
      selectedCountry: 0,
      cities: [],
      selectedCity: 0,
      companies: [],
      selectedCompany: 0,
      companyInfo: {},
      position: {}
    };

    Geocode.setApiKey(GOOGLE_APIKEY);
  }

  // Generic function to group array elements
  groupBy = (list, keyGetter) => {
    const grouped = {};
    list.forEach(item => {
      const key = item[keyGetter];
      if (!grouped[key]) grouped[key] = [item];
      else grouped[key].push(item);
    });
    return grouped;
  };

  // Read client data from json
  // Prepare initial lists to be displayed
  getClientData = () => {
    // Check if "clients.json" exists
    const tryRequire = path => {
      try {
        return require(`${path}`);
      } catch (err) {
        return null;
      }
    };
    const jsonData = tryRequire(CLIENT_DATA_PATH);
    // If no data available, lists remain empty
    if (!jsonData) return;
    const customers = jsonData.Customers;
    const byCountry = this.groupBy(customers, "Country");

    const clientData = {};
    for (let country in byCountry) {
      const byCity = this.groupBy(byCountry[country], "City");

      const countryData = {};
      for (let city in byCity) {
        countryData[city] = byCity[city].sort((a, b) => {
          return a.CompanyName - b.CompanyName;
        });
      }
      clientData[country] = countryData;
    }

    const countries = this.getCountryList(clientData);

    const countryName = countries[0];
    const cities = this.getCityList(clientData[countryName]);

    const cityName = cities[0];
    const companies = clientData[countryName][cityName]
      .map(company => company.CompanyName)
      .sort((a, b) => a - b);

    const companyKey = companies[0];
    const companyInfo = clientData[countryName][cityName].find(
      company => company.CompanyName === companyKey
    );
    this.getCoordinates(companyInfo);

    this.setState({
      clientData: clientData,
      countries: countries,
      selectedCountry: 0,
      cities: cities,
      selectedCity: 0,
      companies: companies,
      selectedCompany: 0,
      companyInfo: companyInfo
    });
  };

  // Prepare list of countries
  getCountryList = clientData => {
    let countries = [];
    for (let country in clientData) {
      countries.push([country, Object.keys(clientData[country]).length]);
    }

    countries.sort((a, b) => {
      return b[1] - a[1];
    });

    return countries.map(country => country[0]);
  };

  // Prepare list of cities
  getCityList = country => {
    let cities = [];
    const countryData =
      country || this.state.clientData[this.state.selectedCountry];

    for (let city in countryData) {
      cities.push([city, Object.keys(countryData[city]).length]);
    }

    cities.sort((a, b) => {
      return b[1] - a[1];
    });

    return cities.map(city => city[0]);
  };

  // Hande selection of new country
  handleSelectCountry = index => {
    // List of countries doesn't change, but derived lists do
    const countryKey = this.state.countries[index];
    const cities = this.getCityList(this.state.clientData[countryKey]);
    const cityKey = cities[0];
    const companies = this.state.clientData[countryKey][cityKey]
      .map(company => company.CompanyName)
      .sort((a, b) => a - b);
    const companyKey = companies[0];
    const companyInfo = this.state.clientData[countryKey][cityKey].find(
      company => company.CompanyName === companyKey
    );
    this.getCoordinates(companyInfo);

    this.setState({
      selectedCountry: index,
      cities: cities,
      selectedCity: 0,
      companies: companies,
      selectedCompany: 0,
      companyInfo: companyInfo
    });
  };

  // Hande selection of new city
  handleSelectCity = index => {
    // List of cities doesn't change, but derived lists do
    const countryKey = this.state.countries[this.state.selectedCountry];
    const cityKey = this.state.cities[index];
    const companies = this.state.clientData[countryKey][cityKey]
      .map(company => company.CompanyName)
      .sort((a, b) => a - b);
    const companyKey = companies[0];
    const companyInfo = this.state.clientData[countryKey][cityKey].find(
      company => company.CompanyName === companyKey
    );
    this.getCoordinates(companyInfo);

    this.setState({
      selectedCity: index,
      companies: companies,
      selectedCompany: 0,
      companyInfo: companyInfo
    });
  };

  // Hande selection of new company
  handleSelectCompany = index => {
    const countryKey = this.state.countries[this.state.selectedCountry];
    const cityKey = this.state.cities[this.state.selectedCity];
    const companyKey = this.state.companies[index];
    const companyInfo = this.state.clientData[countryKey][cityKey].find(
      company => company.CompanyName === companyKey
    );
    this.getCoordinates(companyInfo);

    this.setState({ selectedCompany: index, companyInfo: companyInfo });
  };

  // Get coordinates by company address (to be displayed on map)
  getCoordinates = companyInfo => {
    const address =
      companyInfo.Address +
      ", " +
      companyInfo.City +
      ", " +
      companyInfo.Country;
    Geocode.fromAddress(address).then(
      response => {
        const position = response.results[0].geometry.location;
        this.setState({ position: position });
      },
      error => {
        console.error(error);
      }
    );
  };

  // Create the 'title' row
  getTitleRow = () => {
    const { classes } = this.props;
    return (
      <Grid container spacing={0} className={classes.titleBox}>
        <Grid item xs={2} className={classes.titleText}>
          Countries
        </Grid>
        <Grid item xs={2} className={classes.titleText}>
          Cities
        </Grid>
        <Grid item xs={2} className={classes.titleText}>
          Company
        </Grid>
        <Grid item xs={6} className={classes.titleText}>
          Map
        </Grid>
      </Grid>
    );
  };

  componentDidMount() {
    this.getClientData();
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.clientsData}>
        {this.getTitleRow()}
        <Divider />
        <Grid container spacing={0} className={classes.dataWrapper}>
          <Grid item xs={2}>
            <ListDisplay
              displayedList={this.state.countries}
              selectedElement={this.state.selectedCountry}
              handleSelect={this.handleSelectCountry}
            />
          </Grid>
          <Grid item xs={2}>
            <ListDisplay
              displayedList={this.state.cities}
              selectedElement={this.state.selectedCity}
              handleSelect={this.handleSelectCity}
            />
          </Grid>
          <Grid item xs={2}>
            <ListDisplay
              displayedList={this.state.companies}
              selectedElement={this.state.selectedCompany}
              handleSelect={this.handleSelectCompany}
            />
          </Grid>
          <Grid item xs={6}>
            <MapDisplay
              companyInfo={this.state.companyInfo}
              position={this.state.position}
              apiKey={GOOGLE_APIKEY}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

ClientsData.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClientsData);
