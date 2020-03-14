import React, { Component } from "react";
import ShowMyEvents from "./ShowMyEvents"


export default class Profile extends Component {

  render() {

    this.props.checkIfUser()
    return (
      <div>

        <h1>My Events</h1>

        <div className="container d-flex flex-wrap justify-content-center">

          <ShowMyEvents formatDate={this.props.formatDate} formatTime={this.props.formatTime}  />

        </div>
      </div>
    );
  }
}
