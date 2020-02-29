import React, { Component } from "react";
import FilterMenu from "../FilterMenu/FilterMenu";
import EventCard from "../EventCard/EventCard";
import ShowMyEvents from "./ShowMyEvents"


export default class MyEvents extends Component {
  
    state = {
      myEventsFromDB: [],
      ready: false,
    }
  

async componentDidMount(){
  this.props.getMyEvents()
}

showMyEvents = () => {
  if(this.props.myEventsFromDB)
  return this.props.myEventsFromDB.map((eachEvent, i) => {
    return <EventCard eachEvent={eachEvent} key={i} />;
  });
};

  render() {
    console.log('updated 1 - stay logged in ')
    this.props.checkIfUser();
      return (
        <div>
          {/* <FilterMenu
            selectedOption={this.props.selectedOption}
            filterFunction={this.props.filterFunction}
          /> */}
          <h1>My Events</h1>
          <div className="container d-flex flex-wrap justify-content-center">


        {/* <ShowMyEvents showMyEvents={this.showMyEvents} ready={this.state.ready} /> */}
        {/* {this.showMyEvents()} */}

          </div>
        </div>
      );

    
  }
}
