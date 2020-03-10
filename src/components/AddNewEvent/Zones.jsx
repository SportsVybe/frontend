import React from "react";
import { FormLabel, InputGroup, Row, Col } from "react-bootstrap";
// import baseURL from "../../services/base";
// import Axios from "axios";
//components
// import ZoneSearchInput from "../../ZoneSearchInput/ZoneSearchInput"

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import "../../services/googleapi";

// Styling
import "./Account.css";
import { FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopCircle, faMap } from "@fortawesome/free-solid-svg-icons";

export default class Zones extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      zones: {
        name: "",
        address: "",
        lat: "",
        lng: "",
        place_id: ""
      },
      ready: true
    };
  }

  checkMap = event => {
    event.preventDefault();
    console.log("check map");
    //   let updateZones = {
    //     zones: {
    //       name: this.state.zones.home.name,
    //       address: this.state.zones.home.address,
    //       lat: this.state.zones.home.lat,
    //       lng: this.state.zones.home.lng
    //     }
    //   };

    //   Axios.post(`${baseURL}/api/editprofile/zones`, updateZones, {
    //     withCredentials: true
    //   })
    //     .then(response => {
    //       this.props.setUser(response.data);
    //       console.log("Zone Updated");
    //       this.props.setFlashMessage("Zones are set", true);
    //       // this.props.history.push("/account");
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
  };

  clearLocationInput = location => {
    this.setState({
      address: ""
    });
  };

  handleChange = address => {
    this.setState({ address: address });
  };

  handleSelect = address => {
    geocodeByAddress(address).then(results => {
      let result = results[0];
      this.setState({
        address: result.formatted_address,
        zones: {
          place_id: result.place_id
        }
      });
    });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log(latLng);
        this.setState({
          zones: {
            // name: "home",
            place_id: this.state.zones.place_id,
            lat: latLng.lat,
            lng: latLng.lng
          }
        });

        console.log(this.state);
      })
      .catch(error => console.error("Error", error));
  };
  render() {
    return (
      <div>
        <Row>
          <Col>
            <PlacesAutocomplete
              name="address"
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={address => {
                this.handleSelect(address);
              }}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading
              }) => (
                <>
                  <FormLabel>Location</FormLabel>
                  <InputGroup>
                    <FormControl
                      {...getInputProps({
                        placeholder: "Search Places ...",
                        className: "location-search-input"
                      })}
                    />

                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={event => {
                          this.checkMap(event);
                        }}
                      >
                        <FontAwesomeIcon icon={faMap} /> Map
                      </Button>
                    </InputGroup.Append>
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={this.clearLocationInput}
                      >
                        <FontAwesomeIcon icon={faStopCircle} /> Clear
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </PlacesAutocomplete>
          </Col>
        </Row>
      </div>
    );
  }
}
