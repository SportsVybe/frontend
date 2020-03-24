import React, { Component } from "react";
import GooglePlaceSearchInput from "./GooglePlaceSearchInput";
import Axios from "axios";

// import Header from "../HomeHeader/HomeHeader";
// import Loading from "../Loading/Loading";
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";
import FormInput from "./FormInput";
import baseURL from "../../services/base";
import { myHistory } from "../..";

export default class AddNewEvent extends Component {
  constructor(props) {
    super();
    this.state = {
      title: "",
      description: "",
      sport: "",
      startDate: new Date(),
      message: "",
      venue: {
        name: "",
        address: "",
        lat: "",
        lon: "",
        place_id: "",
        md_parks_id: ""
      },
      venue_id: "",
      showVenueForm: false,
      submitToggle: false,
      confirmVenueToggle: false,
      confirmedVenueNotification: false,
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

  clearVenueInput = venue => {
    this.setState({
      venue_id: "",
      submitToggle: false,
      showVenueForm: false,
      confirmedVenueNotification: false,
      confirmVenueToggle: false
    });
  };

  createNewEvent = (
    e,
    title,
    venue,
    venue_id,
    description,
    sport,
    date
  ) => {
    e.preventDefault();

    let imgGen = sport.toLowerCase() + Math.floor(Math.random() * 3) + ".jpg";
    const newEvent = {
      title: title,
      description: description,
      venue: venue,
      venue_id: venue_id,
      date: date,
      sport: sport,
      img: imgGen,
      // status: status
    };
    // console.log(newEvent)
    this.postEventToDB(newEvent)
  };

  postEventToDB = (newEvent) => {
    Axios
      .post(`${baseURL}/api/event`, newEvent
        , { withCredentials: true }
      )
      .then(res => {
        // let eventCopy = [...this.state.eventsFromDB];
        // // console.log(res)
        // eventCopy.push(res.data.ops[0]);
        // console.log(event)
        console.log(res.data._id)
        this.props.fetchData();
        this.setState(
          {
            message: "Posted Successfully",
            // eventsFromDB: eventCopy
          },
          () =>
            setTimeout(() => {
              this.setState({
                message: ""
              });
              myHistory.push("/singleevent/" + res.data._id);
            }, 1000)
        );
      })
      .catch(err => {
        // console.error(newEvent)
        this.setState({
          message: "Error!"
        });
      });
  }

  matchGooglePlaceSearchWithDB = (placeDetailsFromGoogle) => {

    if (placeDetailsFromGoogle) {
      this.generateEvent();
      this.setState({
        venue: placeDetailsFromGoogle
      })
      const arrOfDBVenues = this.props.listOfVenuesFromDB.map(venues => { return venues })
      const matchedVenueDetails = arrOfDBVenues.filter(eachVenue => { if (eachVenue.name === placeDetailsFromGoogle.name) { return true } });
      if (matchedVenueDetails[0]) {
        console.log("Matched DB")
        this.setState({
          venue_id: matchedVenueDetails[0]._id,
          submitToggle: true,
          confirmedVenueNotification: true
        })
      } else {
        console.log("Not a match in DB")
        // this.matchGooglePlaceToMiamiDadeParkList(placeDetailsFromGoogle);
        this.setState({
          showVenueForm: true,
          confirmVenueToggle: true,
        })
      }
    } else {
      console.log("empty")
    }

  }

  //check if the name from google match any of the name from miami-dade parks
  matchGooglePlaceToMiamiDadeParkList = (placeDetailsFromGoogle) => {
    if (placeDetailsFromGoogle) {
      const arrOfParks = this.props.listOfParks.map(park => { return park.attributes })
      let matchedParkDetails = arrOfParks.filter(park => { if (park.NAME === placeDetailsFromGoogle.name) { return true } });
      function isMatch(matchedPark = "") {
        return matchedPark.NAME === placeDetailsFromGoogle.name ? true : false;
      }
      let venueDetails;
      if (isMatch(matchedParkDetails[0])) {
        venueDetails = {
          name: placeDetailsFromGoogle.name,
          venue_id: this.state.venue_id,
          places_data: placeDetailsFromGoogle,
          parks_data: matchedParkDetails[0],
          sports_available: {
            [this.state.sport]:"Yes"
          }
        };
        console.log("matched with MD");
        this.postVenueToDB(venueDetails)
        this.props.fetchData();
        this.setState({
          confirmedVenueNotification: true,
          submitToggle: true,
        })
      } else {
        venueDetails = {
          name: placeDetailsFromGoogle.name,
          venue_id: this.state.venue_id,
          places_data: placeDetailsFromGoogle,
          sports_available: {
            [this.state.sport]:"Yes"
          }
        };
        console.log("No match");
        this.postVenueToDB(venueDetails)
        this.props.fetchData();
        this.setState({
          confirmedVenueNotification: true,
          submitToggle: true,
        })
      }
    }
  };

  postVenueToDB = (venueDetails) => {
    Axios.post(`${baseURL}/api/newvenue`, venueDetails, {
      withCredentials: true
    })
      .then(response => {
        this.props.setFlashMessage("New venue added!", true);
      })
      .catch(err => {
        this.props.setFlashMessage('Unable to post', false);
      });
  }
  

  render() {

    // this.props.checkIfUser()
    if (this.props.listOfParks)
      return (
        <div>
          <h1>{this.message}</h1>

          <form className="container" >
            <button className={!this.state.submitToggle ? "hide button btn-lg" : undefined}
              onClick={e => {
                this.createNewEvent(
                  e,
                  this.state.title,
                  this.state.venue,
                  this.state.venue_id,
                  this.state.description,
                  this.state.sport,
                  this.state.startDate
                );
              }}>Submit</button>
            <br />
            <br />

            <GooglePlaceSearchInput
              matchGooglePlacetoDB={this.matchGooglePlaceSearchWithDB}
              matchGooglePlaceToMiamiDadeParkList={this.matchGooglePlaceToMiamiDadeParkList}
              clearVenueInput={this.clearVenueInput}
              confirmVenueToggle={this.state.confirmVenueToggle}
              confirmedVenueNotification={this.state.confirmedVenueNotification}
            />

            <div className={!this.state.showVenueForm ? 'hide' : undefined}>

              <FormInput type="text" label="Venue Name" name="venueName" onChange={this.onChange} defaultValue={this.state.venue.name} />

              <FormInput type="text" label="Venue Address" name="venueAddress" onChange={this.onChange} defaultValue={this.state.venue.address} />

              <FormInput type="hidden" name="venue_ID" onChange={this.onChange} defaultValue={this.state.venue_id} />

              <FormInput type="hidden" name="venueID" onChange={this.onChange} defaultValue={this.state.venue.place_id} />

              <FormInput type="hidden" name="venueLat" onChange={this.onChange} defaultValue={this.state.venue.lat} />

              <FormInput type="hidden" name="venueLon" onChange={this.onChange} defaultValue={this.state.venue.lon} />

            </div>

            <FormInput type="text" label="Title" name="title" onChange={this.onChange} defaultValue={this.state.title} />

            <FormInput type="textarea" label="Description" name="description" onChange={this.onChange} defaultValue={this.state.description} />

            <FormInput type="text" label="Sport" name="sport" onChange={this.onChange} defaultValue={this.state.sport} />

            <label htmlFor="date">Date</label>
            <br />
            <DatePicker selected={this.state.startDate}
              // onSelect={this.handleSelect} 
              onChange={this.handleChange}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />

          </form>
        </div>
      );
    else return <>Loading</>;
  }
}
