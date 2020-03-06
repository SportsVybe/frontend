import React, { Component } from "react";
// import FilterMenu from "../FilterMenu/FilterMenu";
// import EventCard from "../EventCard/EventCard";
import ShowMyEvents from "./ShowMyEvents"


export default class MyEvents extends Component {
  
    // state = {
    //   myEventsFromDB: [],
    //   ready: false,
    // }
  

// async componentDidMount(){
//   this.props.getMyEvents()
// }



  render() {
    // console.log(this.props.myEventsFromDB)
    this.props.checkIfUser()
      return (
        <div>
          {/* <FilterMenu
            selectedOption={this.props.selectedOption}
            filterFunction={this.props.filterFunction}
          /> */}
          <h1>My Events</h1>
          <div className="container d-flex flex-wrap justify-content-center">


        <ShowMyEvents myEventsFromDB={this.props.myEventsFromDB} getMyEvents={this.props.getMyEvents} ready={this.props.ready} />
        {/* {this.showMyEvents()} */}

          </div>
        </div>
      );

    
  }
}
