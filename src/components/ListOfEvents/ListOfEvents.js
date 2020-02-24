import React, { Component } from "react";
import FilterMenu from "../FilterMenu/FilterMenu";
import EventCard from "../EventCard/EventCard";

export default class ListOfEvents extends Component {
  
  showEvents = () => {
    return this.props.listOfEvents.map((eachEvent, i) => {
      return <EventCard eachEvent={eachEvent} key={i} />;
    });
  };

  render() {
    if (this.props.listOfEvents)
      return (
        <div>
          <FilterMenu
            selectedOption={this.props.selectedOption}
            filterFunction={this.props.filterFunction}
          />
          <h1>List of Events</h1>
          <div className="container d-flex flex-wrap justify-content-center">

          {this.showEvents()}
          </div>
        </div>
      );
    else return <div>Loading...</div>;
  }
}
