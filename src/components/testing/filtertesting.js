import React, { Component } from "react";

export default class filtertesting extends Component {
  constructor(props) {
    super();
    this.state = {
      parks: ''
    };
  }
  parkFilterFunction = e => {
    let parkFiltered;
    let sportButton = e.target.name.toUpperCase()
    console.log(sportButton)
    //if target checked is true then filter parks by sport with the target name (ie. basketball, soccer, etc)
    if (e.target.checked === true) {
      let parksCopy = [...this.props.listOfParks];
      parkFiltered = parksCopy.filter(
        res => res.attributes[sportButton] === "Yes"
      );
      this.setState({ parks: parkFiltered });
      // console.log(this.state.parks)
    } else {
      this.setState({ parks: this.props.listOfParks });
    }
  };

  showEvents = () => {
    // console.log(this.props.listOfParks)
    let showData;
    if (this.state.parks === '') {
      showData = this.props.listOfParks;
    } else {
      showData = this.state.parks;
    }
    return showData.map((res, i) => {
      return <li key={i}>{res.attributes.NAME}</li>;
    });
  };
  render() {
    if (this.props.listOfParks && this.props.listOfEvents)
      return (
        <div>
          <h1>Filter Testing</h1>
          basketball:{" "}
          <input
            type="checkbox"
            name="basketball"
            onClick={this.parkFilterFunction}
            // onClick={this.eventHandler}
          />
          <br />
          soccer:{" "}
          <input
            type="checkbox"
            name="soccer"
            onClick={this.parkFilterFunction}
            // onClick={this.eventHandler}
          />
          <br />
          baseball:{" "}
          <input
            type="checkbox"
            name="baseball"
            onClick={this.parkFilterFunction}
            // onClick={this.eventHandler}
          />
          <br />
          yoga:{" "}
          <input
            type="checkbox"
            name="yoga"
            onClick={this.parkFilterFunction}
            // onClick={this.eventHandler}
          />
          <br />
          <ul>{this.showEvents()}</ul>
        </div>
      );
    else return <h1>Loading....</h1>;
  }
}
