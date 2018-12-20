import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "40%",
  height: "350px",
  position: "relative"
};

export class MapDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {}
    };
  }

  updatePosition = () => {
    this.setState({ position: this.props.position });
  };

  render() {
    return (
      <Map
        google={this.props.google}
        style={mapStyles}
        className={"map"}
        center={this.state.position}
        zoom={14}
        onReady={this.updatePosition}
      >
        <Marker
          title={this.props.companyInfo.CompanyName}
          name={this.props.companyInfo.Address}
          position={this.state.position}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.apiKey
}))(MapDisplay);
