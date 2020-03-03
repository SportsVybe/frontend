import React from "react";
import { Link } from "react-router-dom";
import MapComponent from "../Map/MapComponent";
// import Loading from "../Loading/Loading";

//import images dynamically to the img src value
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

class EventPage extends React.Component {
  render() {
    // console.log(this.state.theEvent)

    // if (this.props.listOfEvents) {
      let theEventDetails = this.props.listOfEvents.find(event => {
        return event._id === this.props.match.params.id;
      });
      let theEvent = theEventDetails;
      return (
        <div className="event-page">
          <div
            className="container-fluid event-page-heading"
            style={{ backgroundImage: "url(" + images[theEvent.img] + ")" }}
          ></div>
          <div className="container">
            <div className="row">
              <div className="col-12 event-title">
                <h1>{theEvent.title}</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-5 event-page-info">
                <h5>Date: {theEvent.date}</h5>
                <h5>Time: {theEvent.time}</h5>
                <hr />
                <h4>Event Organizer</h4>
                <h5>User: {theEvent.user}</h5>
                <hr />
                <h4>About The Event</h4>
                <h5>Sport: {theEvent.sport.toUpperCase()}</h5>
                <p>{theEvent.description}</p>
              </div>
              <div className="col-12 col-md-5 event-page-location map">
                <h4>Map</h4>
                <Link to={"/singlepark/" + theEvent.location.id}>
                  <h4>{theEvent.location.name}</h4>
                </Link>
                <p>{theEvent.location.address}</p>
                <MapComponent
                  lat={theEvent.location.lat}
                  lon={theEvent.location.lon}
                  details={theEvent}
                  id="event"
                />
              </div>
            </div>
          </div>
        </div>
      );
    } 
  //   else {
  //     return <Loading />;
  //   }
  // }
}

export default EventPage;
