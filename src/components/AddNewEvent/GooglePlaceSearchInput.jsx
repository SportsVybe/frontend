import React from "react";
import { FormLabel, InputGroup, Row, Col } from "react-bootstrap";
// import baseURL from "../../services/base";
// import Axios from "axios";
//components
// import venueearchInput from "../../venueearchInput/venueearchInput"

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

// import "../../services/googleapi";

// Styling
import "./Account.css";
import { FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopCircle,
  faCheck,
  faSearch,
  faStar
} from "@fortawesome/free-solid-svg-icons";

export default class GooglePlaceSearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      googlePlace: ""
    };
  }

  clearVenueInput = () => {
    this.setState({
      address: "",
      googlePlace: ""
    });
    this.props.clearVenueInput();
  };

  handleChange = address => {
    this.setState({ address: address });
  };

  handleSelect = address => {
    geocodeByAddress(address).then(results => {
      let result = results[0];
      let name = result.address_components[0];
      this.setState({
        address: result.formatted_address,
        googlePlace: {
          name: name.long_name,
          address: result.formatted_address,
          place_id: result.place_id
        }
      });
    });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          googlePlace: {
            name: this.state.googlePlace.name,
            address: this.state.googlePlace.address,
            place_id: this.state.googlePlace.place_id,
            lat: latLng.lat,
            lon: latLng.lng
          }
        });
      })
      .catch(error => console.error("Error", error));
  };

  render() {
    return (
      <div>
        {/* {venue_detail = this.state.venue} */}
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
                  <FormLabel>Venue</FormLabel>
                  <InputGroup>
                    {!this.props.disableSearchInput ? (
                      <FormControl
                      {...getInputProps({
                        placeholder: "Google Search ...",
                        className: "venue-search-input"
                      })}
                    />
                    ) : (<FormControl
                      {...getInputProps({
                        placeholder: "Google Search ...",
                        className: "venue-search-input"
                      })}
                      disabled
                    />)}
                    
                    {this.props.confirmedVenueNotification ? (
                      <InputGroup.Append>
                        <Button variant="outline-success" disabled="disabled">
                          <FontAwesomeIcon icon={faStar} />
                        </Button>
                      </InputGroup.Append>
                    ) : this.props.confirmVenueToggle ? (
                      <InputGroup.Append>
                        <Button
                          variant="outline-warning"
                          onClick={() => {
                            this.props.matchGooglePlaceToMiamiDadeParkList(
                              this.state.googlePlace
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} /> Confirm
                        </Button>
                      </InputGroup.Append>
                    ) : (
                      <InputGroup.Append>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            this.props.matchGooglePlacetoDB(
                              this.state.googlePlace
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} /> Search
                        </Button>
                      </InputGroup.Append>
                    )}
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={this.clearVenueInput}
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
