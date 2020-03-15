import React, { Component } from "react";
import GooglePlaceSearchInput from "./GooglePlaceSearchInput";
import Axios from "axios";

// import Header from "../HomeHeader/HomeHeader";
// import Loading from "../Loading/Loading";
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";
import FormInput from "./FormInput";
import baseURL from "../../services/base";

export default class AddNewEvent extends Component {
  constructor(props) {
    super();
    this.state = {
      title: "",
      venue: {
        name: "",
        address: "",
        lat: "",
        lon: "",
        place_id: "",
        md_parks_id: ""
      },
      description: "",
      sport: "",
      message: "",
      startDate: new Date(),
      eventDescriptionLorem: ["Foul line 4-bagger slide hardball outfielder, rally left on base field. Fair right field 1-2-3 dead red bag passed ball double play.", "At-bat bleeder warning track starter wins cycle arm reds around the horn. Bunt shift shutout off-speed second base left on base rip sacrifice.", "Gap robbed outside range right fielder hey batter national pastime wins. Fair first base bunt chin music pine tar hot dog dead ball era astroturf lineup."],
      sports: ["Soccer", "Basketball", "Volleyball", "Baseball"],
      eventTitleOptions: ["Pick-Up", "League", "Practice", "Try-Outs"],
    };
  }

  handleInput = e => {
    // 
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  generateEvent = () => {
    const sport = this.state.sports[Math.floor(Math.random() * 4)];
    this.setState({
      title: sport + " " + this.state.eventTitleOptions[Math.floor(Math.random() * 4)],
      sport: sport,
      description: this.state.eventDescriptionLorem[Math.floor(Math.random() * 3)],
    })
  }

  matchGooglePlacetoDB = (placeDetailsFromGoogle) => {
    this.generateEvent();
    this.setState({
      venue: placeDetailsFromGoogle
    })
    const arrOfDBVenues = this.props.listOfVenuesFromDB.map(venue => {return venue})
  }

  //check if the name from google match any of the name from miami-dade parks
  matchGooglePlaceToMiamiDadeParkList = (placeDetailsFromGoogle) => {
    // e.preventDefault();
    
    const arrOfParks = this.props.listOfParks.map(park => {return park.attributes})

    let matchedParkDetails = arrOfParks.filter(park => { if (park.NAME === placeDetailsFromGoogle.name) { return true } });

    function isMatch(matchedPark="") {
      return matchedPark.NAME === placeDetailsFromGoogle.name ? true : false;
    }

    if(placeDetailsFromGoogle.name===""){
      console.log("No place details")
    }
    else if (isMatch(matchedParkDetails[0])) {
      let venueDetails = {
        name: placeDetailsFromGoogle.name,
        places_data: placeDetailsFromGoogle,
        parks_data: matchedParkDetails[0]
      };
      
      this.postVenueToDB(venueDetails)
    } else {
      this.props.setFlashMessage('Not a match', false);
      let venueDetails = {
        name: placeDetailsFromGoogle.name,
        places_data: placeDetailsFromGoogle
      };
      this.postVenueToDB(venueDetails)
    }
  };

  postVenueToDB = (venueDetails) => {
    Axios.post(`${baseURL}/api/newvenue`, venueDetails, {
      withCredentials: true
    })
      .then(response => {
        // this.props.setUser(response.data);
        this.props.setFlashMessage("New venue added!", true);
        // this.props.history.push("/account");
      })
      .catch(err => {
        this.props.setFlashMessage('Unable to post', false);
      });
  }

  render() {

    if (this.props.listOfParks)
      return (
        <div>
          <h1>{this.props.message}</h1>
        
          <form
            className="container"
            onSubmit={e => {
              this.props.createNewEvent(
                e,
                this.state.title,
                this.state.venue,
                this.state.description,
                this.state.sport,
                this.state.startDate
              );
            }}
          >
            <button className="button btn-lg">Submit</button>
            <br />

            <GooglePlaceSearchInput
              matchVenue={this.matchGooglePlaceToMiamiDadeParkList}
            />

            <FormInput type="text" name="venueID" onChange={this.onChange} defaultValue={this.state.venue.place_id} />

            <FormInput type="text" name="venueName" onChange={this.onChange} defaultValue={this.state.venue.name} />

            <FormInput type="text" name="venueAddress" onChange={this.onChange} defaultValue={this.state.venue.address} />

            <FormInput type="text" name="venueLat" onChange={this.onChange} defaultValue={this.state.venue.lat} />

            <FormInput type="text" name="venueLon" onChange={this.onChange} defaultValue={this.state.venue.lon} />

            <FormInput type="text" name="title" onChange={this.onChange} defaultValue={this.state.title} />

            <FormInput type="textarea" name="description" onChange={this.onChange} defaultValue={this.state.description} />

            <FormInput type="text" name="sport" onChange={this.onChange} defaultValue={this.state.sport} />

            <label htmlFor="date">Date</label>
            <br />
            <DatePicker selected={this.state.startDate}
              // onSelect={this.handleSelect} 
              onChange={this.handleChange}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            /><br />

          </form>
        </div>
      );
    else return <>Loading</>;
  }
}
