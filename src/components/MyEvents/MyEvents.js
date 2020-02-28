import React, { Component } from "react";
import FilterMenu from "../FilterMenu/FilterMenu";
import EventCard from "../EventCard/EventCard";


export default class MyEvents extends Component {
  

  showMyEvents = () => {
    return this.props.myEventsFromDB.map((eachEvent, i) => {
      return <EventCard eachEvent={eachEvent} key={i} />;
    });
  };

  render() {
    if (this.props.ready)
      return (
        <div>
          {/* <FilterMenu
            selectedOption={this.props.selectedOption}
            filterFunction={this.props.filterFunction}
          /> */}
          <h1>My Events</h1>
          <div className="container d-flex flex-wrap justify-content-center">

          {this.showMyEvents()}
          </div>
        </div>
      );
    else return <div>Loading...</div>;
  }
}
