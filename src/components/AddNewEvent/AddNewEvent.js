import React, { Component } from "react";
// import Axios from "axios";
// import Header from "../HomeHeader/HomeHeader";
import Loading from "../Loading/Loading";

export default class AddNewEvent extends Component {
  constructor(props) {
    super();
    this.state = {
      title: "",
      location: {
        address: "",
        lat: 0,
        lon: 0,
        name: "",
        id: ""
      },
      description: "",
      sport: "",
      date:
        Math.floor(Math.random() * 11 + 1) +
        "/" +
        Math.floor(Math.random() * 28 + 1) +
        "/2020",
      time:
        Math.floor(Math.random() * 11 + 1) +
        ":" +
        Math.floor(Math.random() * 60 + 1),
      message: ""
    };
  }

  handleInput = e => {
    // console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    // console.log(this.props.description)
    setTimeout(() => {
      this.setState({
        location: {
          name: this.props.listOfParks[Math.floor(Math.random() * 792)]
            .attributes.NAME,
          address: this.props.listOfParks[Math.floor(Math.random() * 792)]
            .attributes.ADDRESS,
          lat: this.props.listOfParks[Math.floor(Math.random() * 792)]
            .attributes.LAT,
          lon: this.props.listOfParks[Math.floor(Math.random() * 792)]
            .attributes.LON,
          id: this.props.listOfParks[Math.floor(Math.random() * 792)].attributes
            .ID
        }
      });
    }, 5000);
    if (this.props.listOfParks)
      return (
        <div>
          {/* <Header /> */}
          <h1>{this.props.message}</h1>
          <form
            className="container"
            onSubmit={e => {
              this.props.submitEventFunction(
                e,
                this.props.sports[Math.floor(Math.random() * 4)]
                +" " +
                this.props.eventTitleOptions[Math.floor(Math.random() * 4)],
                this.state.location,
                this.props.descriptionLorem[Math.floor(Math.random() * 5)],
                this.props.sports[Math.floor(Math.random() * 4)],
                this.state.date,
                this.state.time
              );
            }}
          >
            <button className="button btn-lg">Submit</button>
            <br />
            <label htmlFor="title">title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              onChange={this.handleInput}
              defaultValue={
                this.props.sports[Math.floor(Math.random() * 2)] +
                " " +
                this.props.eventTitleOptions[Math.floor(Math.random() * 4)]
              }
            />
            <label htmlFor="location">Location ID</label>
            <input
              className="form-control"
              type="text"
              name="location"
              onChange={this.handleInput}
              defaultValue={this.state.location.id}
            />
            <label htmlFor="location">Location Name</label>
            <input
              className="form-control"
              type="text"
              name="location"
              onChange={this.handleInput}
              defaultValue={this.state.location.name}
            />
            <label htmlFor="location">Location Address</label>
            <input
              className="form-control"
              type="text"
              name="location"
              onChange={this.handleInput}
              defaultValue={this.state.location.address}
            />
            <label htmlFor="location">Location Lat</label>
            <input
              className="form-control"
              type="text"
              name="location"
              onChange={this.handleInput}
              defaultValue={this.state.location.lat}
            />
            <label htmlFor="location">Location Long</label>
            <input
              className="form-control"
              type="text"
              name="location"
              onChange={this.handleInput}
              defaultValue={this.state.location.lon}
            />
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              type="text"
              name="description"
              height="100px"
              onChange={this.handleInput}
              value={this.props.descriptionLorem[Math.floor(Math.random() * 4)]}
            ></textarea>
            <label htmlFor="sport">Sport</label>
            <input
              className="form-control"
              type="text"
              name="sport"
              onChange={this.handleInput}
              value={this.props.sports[Math.floor(Math.random() * 2)]}
              // {this.state.sport}
            />
            <label htmlFor="date">Date</label>
            <input
              className="form-control"
              type="text"
              name="date"
              onChange={this.handleInput}
              defaultValue={this.state.date}
            />
            <label htmlFor="time">Time</label>
            <input
              className="form-control"
              type="text"
              name="time"
              onChange={this.handleInput}
              defaultValue={this.state.time}
            />
            <label htmlFor="user">User</label>
            <input
              className="form-control"
              type="text"
              name="user"
              onChange={this.handleInput}
              defaultValue={this.state.user}
            />
          </form>
        </div>
      );
    else return <Loading />;
  }
}
