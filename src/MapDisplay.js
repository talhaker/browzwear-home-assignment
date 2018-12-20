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
      position: {},
      firstTime: true
    };
  }

  updatePosition = () => {
    this.setState({ position: this.props.position });
  };

  componentWillReceiveProps = () => {
    this.setState({
      position: this.props.position,
      firstTime: false
    });
  };

  render() {
    const position = this.state.firstTime
      ? this.state.position
      : this.props.position;
    return (
      <Map
        google={this.props.google}
        style={mapStyles}
        className={"map"}
        center={position}
        zoom={14}
        onReady={this.updatePosition}
      >
        <Marker
          title={this.props.companyInfo.CompanyName}
          name={this.props.companyInfo.Address}
          position={position}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper(props => ({
  apiKey: props.apiKey
}))(MapDisplay);
