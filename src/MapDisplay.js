import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "520px",
  height: "350px",
  position: "relative"
};

export class MapDisplay extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        style={mapStyles}
        className={"map"}
        center={this.props.position}
        zoom={14}
      >
        <Marker
          title={this.props.companyInfo.Address}
          name={this.props.companyInfo.CompanyName}
          position={this.props.position}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.apiKey
}))(MapDisplay);
