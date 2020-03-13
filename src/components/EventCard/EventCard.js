import React, { Component } from "react";
import { Link } from "react-router-dom";
// import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
var moment = require('moment');

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    return (images[item.replace("./", "")] = r(item));
  });
  return images;
}

const images = importAll(
  require.context("../../images", false, /\.(png|jpe?g|svg)$/)
);


export default class EventCard extends Component {
  
  formatDate = () => {
    return moment(this.props.eachEvent.date).format('dddd, MMMM Do, YYYY');
  }

  formatTime = () => {
   return moment(this.props.eachEvent.date).format('h:mm A');
  }
  
  
  render() {
    // const date =  this.props.eachEvent.date;
    // const time =  this.props.eachEvent.date.toLocaleTimeString('en-US');
    return (
      <div className="event-card col-12 col-md-5" >
        <Link to={"/singleevent/" + this.props.eachEvent._id}>
          <div
            className="event-card-heading"
            style={{
              backgroundImage:
                "url(" + images[this.props.eachEvent.img] + ")"
            }}
          ></div>
        </Link>
        <div className="event-card-info">
          <h4 className="title">{this.props.eachEvent.title}</h4>
          <div className="row">
            <div className="col-6">
              <p className="date flex-row d-flex align-items-center">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{this.formatDate()}</span>
              </p>
              <p className="time flex-row d-flex align-items-center">
                <FontAwesomeIcon icon={faClock} />
                <span>{this.formatTime()}</span>
              </p>
            </div>
            <div className="col-6">
              <h5 className="location-name">
                {this.props.eachEvent.location.name}
              </h5>
              <h6>{this.props.eachEvent.location.address}</h6>
            </div>
          </div>

          {/* Date: {this.props.eachEvent[i].date} */}
          {/* <p className="contributor">Phone: {this.props.eachEvent.PHONE}</p> */}
        </div>
       
      </div>
    );
  }
}
