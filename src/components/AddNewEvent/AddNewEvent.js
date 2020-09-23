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
      venue_id: null,
      message: "",
      venue: {
        name: null,
        address: null,
        lat: null,
        lon: null,
        place_id: null
      },
      latLon: {
        lat: null,
        lon: null,
      },
      showVenueForm: false,
      submitToggle: false,
      confirmVenueToggle: false,
      confirmedVenueNotification: false,
      disableSearchInput: false,
      eventDescriptionLorem: ["Foul line 4-bagger slide hardball outfielder, rally left on base field. Fair right field 1-2-3 dead red bag passed ball double play.", "At-bat bleeder warning track starter wins cycle arm reds around the horn. Bunt shift shutout off-speed second base left on base rip sacrifice.", "Gap robbed outside range right fielder hey batter national pastime wins. Fair first base bunt chin music pine tar hot dog dead ball era astroturf lineup."],
      sports: ["Soccer", "Basketball", "Volleyball", "Baseball"],
      eventTitleOptions: ["Pick-Up", "League", "Practice", "Try-Outs"],
    };
  }

  handleInput = e => {
    // 
    this.setState({
       [e.target.name]: e.target.value 
    }, () => { console.log(this.state) });
  };

  handleVenueInput = e => {
    // 
    this.setState({
      venue: { [e.target.name]: e.target.value }
    }, () => { console.log(this.state.venue) });
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
      venue_id: null,
      submitToggle: false,
      showVenueForm: false,
      confirmedVenueNotification: false,
      confirmVenueToggle: false,
      disableSearchInput: false,
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
        // console.log(res)
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
        venue: placeDetailsFromGoogle,
      })
      const arrOfDBVenues = this.props.listOfVenuesFromDB.map(venues => { return venues });
      // eslint-disable-next-line
      const matchedVenueDetails = arrOfDBVenues.filter(eachVenue => { if (eachVenue.name === placeDetailsFromGoogle.name) { return true } });

      if (matchedVenueDetails[0]) {
        if (matchedVenueDetails[0].places_data !== "") {
          console.log("Matched DB");
          this.setState({
            venue_id: matchedVenueDetails[0]._id,
            places_data: placeDetailsFromGoogle,
            submitToggle: true,
            confirmedVenueNotification: true,
            disableSearchInput: true
          })
        } else {
          console.log("Need to update")

          let venue_id = matchedVenueDetails[0]._id;
          let venueDetails = {
            places_data: placeDetailsFromGoogle,
          };

          Axios.post(`${baseURL}/api/venue/update/${venue_id}`, venueDetails, {
            withCredentials: true,
            useFindAndModify: false
          })
            .then(response => {
              this.props.setFlashMessage("updated!", true);
            })
            .catch(err => {
              this.props.setFlashMessage('Unable to update', false);
            });

        }

      } else {
        console.log("Not a match in DB")
        // this.matchGooglePlaceToMiamiDadeParkList(placeDetailsFromGoogle);
        this.setState({
          showVenueForm: true,
          confirmVenueToggle: true,
          disableSearchInput: true
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
      // eslint-disable-next-line
      let matchedParkDetails = arrOfParks.filter(park => { if (park.NAME === placeDetailsFromGoogle.name) { return true } });
      function isMatch(matchedPark = "") {
        return matchedPark.NAME === placeDetailsFromGoogle.name ? true : false;
      }
      let venueDetails;
      if (isMatch(matchedParkDetails[0])) {
        venueDetails = {
          name: placeDetailsFromGoogle.name,
          places_data: this.state.venue,
          parks_data: matchedParkDetails[0],
          sports_available: {
            [this.state.sport]: "Yes"
          }
        };
        console.log("matched with MD");
        this.postVenueToDB(venueDetails)
        this.props.fetchData();
        this.setState({
          confirmedVenueNotification: true,
          submitToggle: true,
          disableSearchInput: true
        }, () => {
          console.log(this.state)
        })
      } else {
        venueDetails = {
          name: placeDetailsFromGoogle.name,
          places_data: this.state.venue,
          sports_available: {
            [this.state.sport]: "Yes"
          }
        };
        console.log("No match");
        this.postVenueToDB(venueDetails)
        this.props.fetchData();
        this.setState({
          confirmedVenueNotification: true,
          submitToggle: true,
          disableSearchInput: true
        }, () => {
          console.log(this.state)
        })
      }
    }
  };

  postVenueToDB = (venueDetails) => {
    Axios.post(`${baseURL}/api/venue/create`, venueDetails, {
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
              disableSearchInput={this.state.disableSearchInput}
            />

            <div className={!this.state.showVenueForm ? 'hide' : undefined}>

              <FormInput type="text" label="Venue Name" name="name" onChange={this.handleVenueInput} value={this.state.venue.name} />

              <FormInput type="text" label="Venue Address" name="address" onChange={this.handleVenueInput} value={this.state.venue.address} />

              <FormInput type="hidden" name="venue_id" onChange={this.handleVenueInput} value={this.state.venue_id} />

              <FormInput type="hidden" name="place_id" onChange={this.handleVenueInput} value={this.state.venue.place_id} />

              <FormInput type="hidden" name="lat" onChange={this.handleVenueInput} value={this.state.venue.lat} />

              <FormInput type="hidden" name="lon" onChange={this.handleVenueInput} value={this.state.venue.lon} />

            </div>

            <FormInput type="text" label="Title" name="title" onChange={this.handleInput} value={this.state.title} />

            <FormInput type="textarea" label="Description" name="description" onChange={this.handleInput} value={this.state.description} />

            <FormInput type="text" label="Sport" name="sport" onChange={this.handleInput} value={this.state.sport} />

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
