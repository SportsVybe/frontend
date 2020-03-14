import React, { Component } from "react";
import GooglePlaceSearchInput from "./GooglePlaceSearchInput";
// import Axios from "axios";
// import Header from "../HomeHeader/HomeHeader";
// import Loading from "../Loading/Loading";
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";
import FormInput from "./FormInput";

export default class AddNewEvent extends Component {
  constructor(props) {
    super();
    this.state = {
      title: "",
      location: {
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
    // console.log(e.target.value)
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




  matchGooglePlaceToMiamiDadeParkList = (e, placeDetailsFromGoogle) => {
    e.preventDefault();
    // let placeToCheck = placeDetailsFromGoogle;

    const arrOfParks = this.props.listOfParks.map(park => {
      return park.attributes
    })

    function isMatch(park){
      if(park.NAME===placeDetailsFromGoogle.name){return true}
    }
    // return arrOfParks
   
    console.log(placeDetailsFromGoogle)
    console.log("=======")

    console.log(arrOfParks.filter(isMatch));



    this.generateEvent();
    this.setState({
      location: placeDetailsFromGoogle
    })

    //   let updatelocation = {
    //     location: {
    //       name: this.state.location.home.name,
    //       address: this.state.location.home.address,
    //       lat: this.state.location.home.lat,
    //       lng: this.state.location.home.lng
    //     }
    //   };

    //   Axios.post(`${baseURL}/api/editprofile/location`, updatelocation, {
    //     withCredentials: true
    //   })
    //     .then(response => {
    //       this.props.setUser(response.data);
    //       console.log("Zone Updated");
    //       this.props.setFlashMessage("location are set", true);
    //       // this.props.history.push("/account");
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
  };

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
                this.state.location,
                this.state.description,
                this.state.sport,
                this.state.startDate
              );
            }}
          >
            <button className="button btn-lg">Submit</button>
            <br />

            <GooglePlaceSearchInput
              matchLocationToDB={this.matchLocationToDB}
            />

            <FormInput type="text" name="locationID" onChange={this.onChange} defaultValue={this.state.location.place_id} />

            <FormInput type="text" name="locationName" onChange={this.onChange} defaultValue={this.state.location.name} />

            <FormInput type="text" name="locationAddress" onChange={this.onChange} defaultValue={this.state.location.address} />

            <FormInput type="text" name="locationLat" onChange={this.onChange} defaultValue={this.state.location.lat} />

            <FormInput type="text" name="locationLon" onChange={this.onChange} defaultValue={this.state.location.lon} />

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
