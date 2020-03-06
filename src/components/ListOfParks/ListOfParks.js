import React, { Component } from "react";
import Loading from "../Loading/Loading";
import FilterMenu from '../FilterMenu/FilterMenu'
import ParkCard from "../ParkCard/ParkCard";


export default class ListOfParks extends Component {


  showParks = () => {
    return this.props.listOfParks.map((eachPark, i) => {
      return (
       <ParkCard eachPark={eachPark} key={i} distance={this.props.distanceFunction(this.props.userLocation.latitude,this.props.userLocation.longitude,eachPark.attributes.LAT,eachPark.attributes.LON,"N")} />
       );
    });
  };


  render() {
    if (this.props.listOfParks)
      return (
        <div>
         <FilterMenu selectedOption={this.props.selectedOption} filterFunction={this.props.filterFunction} />
          <h1>List of Parks</h1>
          <div className="container d-flex flex-wrap">
  
          {this.showParks()}
          </div>
        </div>

      );
    else return <Loading />;
  }
}
