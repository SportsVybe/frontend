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
import { faStopCircle, faCheck } from "@fortawesome/free-solid-svg-icons";

export default class GooglePlaceSearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      venue: {
        name: "",
        address: "",
        lat: "",
        lon: "",
        id: "",
        place_id: ""
      },
    };
  }

  clearVenueInput = venue => {
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
      let name = result.address_components[0];
      this.setState({
        address: result.formatted_address,
        venue: {
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
          venue: {
            name: this.state.venue.name,
            address: this.state.venue.address,
            place_id: this.state.venue.place_id,
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
                  <FormLabel>Search</FormLabel>
                  <InputGroup>
                    <FormControl
                      {...getInputProps({
                        placeholder: "Search Places ...",
                        className: "venue-search-input"
                      })}
                    />

                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          this.props.matchVenue(this.state.venue)
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Check
                      </Button>
                    </InputGroup.Append>
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