import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import InfoWindowEx from "./InfoWindowEx";
import { myHistory } from "../../index.js";
// import UserMarker from "./UserMarker";
import FilterMenu from "../FilterMenu/FilterMenu";
import parkImg from "../../images/park-map.png";
import eventImg from "../../images/league-map.png";
// import Loading from "../Loading/Loading.jsx";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      showDetailsLink: '',
      center: {
        lat: this.props.userLocation.latitude || 25.7617,
        lng: this.props.userLocation.longitude || -80.1918
      }
    };
  }

  onMarkerClick = (props, marker, e) => {
    console.log(props.id)
    if (props.id === "park") {
      this.setState({
        selectedPlace: props.place_,
        selectedPlaceName: props.place_.attributes.NAME,
        selectedPlaceId: props.place_.attributes.ID,
        selectedPlaceLink: "/singlepark/",
        activeMarker: marker,
        showingInfoWindow: true,
        center: {
          lat: props.place_.attributes.LAT,
          lng: props.place_.attributes.LON
        }
      });
    }
    else if (props.id === "event") {
      this.setState({
        selectedPlace: props.place_,
        selectedPlaceName: props.place_.title,
        selectedPlaceId: props.place_._id,
        selectedPlaceLink: "/singleevent/",
        activeMarker: marker,
        showingInfoWindow: true,
        center: {
          lat: props.place_.lat,
          lng: props.place_.lon
        }
      });
    };
  }

  showDetails = () => {
    myHistory.push(this.state.selectedPlaceLink + this.state.selectedPlaceId)
  };

  render() {
    if (this.props.ready) {
      return (
        <div>
          <Map
            google={this.props.google}
            className={"map"}
            zoom={12}
            initialCenter={this.state.center}
            center={{
              lat: this.state.center.lat,
              lng: this.state.center.lng
            }}
          >
            {this.props.parkData.map((place, i) => {
              return (
                <Marker
                  onClick={this.onMarkerClick}
                  key={i}
                  id={"park"}
                  place_={place}
                  icon={{ url: parkImg }}
                  position={{
                    lat: place.attributes.LAT,
                    lng: place.attributes.LON
                  }}
                // icon={"../images/park-map.png"}
                />
              );
            })}
            {this.props.eventData.map((place, i) => {
              return (
                <Marker
                  onClick={this.onMarkerClick}
                  key={i}
                  id={"event"}
                  place_={place}
                  icon={{ url: eventImg }}
                  position={{ lat: place.venue.lat, lng: place.venue.lon }}
                />
              );
            })}
            <Marker
              key={"User"}
              name={"User Location"}
              position={{
                lat: this.props.userLocation.latitude,
                lng: this.props.userLocation.longitude
              }}
            />
            <InfoWindowEx
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
              <div>
                <h4>{this.state.selectedPlaceName}</h4>
                <button
                  type="button"
                  onClick={this.showDetails.bind(this, this.state.selectedPlace)}
                >
                  Show details
              </button>
              </div>
            </InfoWindowEx>
          </Map>
          <FilterMenu selectedOption={this.props.selectedOption} filterFunction={this.props.filterFunction} />
        </div>
      );
    } else {
      return <>Loading</>;
    }
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDZiBSkaZztK2mN3Q8QzvzcfPCsDX2_p58"
})(MapContainer);
