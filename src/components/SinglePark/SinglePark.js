import React from "react";
// import Loading from "../Loading/Loading.js";
import EventCard from "../EventCard/EventCard";
import MapComponent from "../Map/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketballBall,
  faVolleyballBall,
  faFutbol,
  faBaseballBall,
  // faCalendarPlus
} from "@fortawesome/free-solid-svg-icons";
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    return (images[item.replace("./", "")] = r(item));
  });
  return images;
}

const images = importAll(
  require.context("../../images/parks", false, /\.(png|jpe?g|svg)$/)
);
class ParkPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      venue: {
        address: "",
        name: "",
      },
      phone: "",
      sport: "",
      user: "User " + Math.floor(Math.random() * 1000),
      message: ""
    };
  }
  handleInput = e => {
    // console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  //find events for the list of event that match the current park
  eventsAtThisPark = () => {
    //eslint-disable-next-line
    let copyOfParkList = this.props.listOfEvents.map((events, i) => {
      //NEED TO UPDATE venue.id to venue.md_parks_id
      if (events.venue.id === this.props.match.params.id) {
        return <EventCard formatDate={this.props.formatDate} formatTime={this.props.formatTime} eachEvent={events} key={i} />;
      }
    });
    return copyOfParkList;
  };

  render() {
    // console.log(this.props.distanceFunction)
    //if the list of parks has loaded then return the data
    if (this.props.listOfParks && this.props.listOfEvents) {
      //find the correct park by id from the props list of parks
      let thePark = this.props.listOfParks.find(park => {
        return park.attributes.ID === this.props.match.params.id;
      });
      let listOfSports = [];
      if (thePark.attributes.BASKETBALL === "Yes") {
        listOfSports.push(<FontAwesomeIcon icon={faBasketballBall} key={1} />);
      }
      if (thePark.attributes.VOLLEYBALL === "Yes") {
        listOfSports.push(<FontAwesomeIcon icon={faVolleyballBall} key={2} />);
      }
      if (thePark.attributes.BASEBALL === "Yes") {
        listOfSports.push(<FontAwesomeIcon icon={faBaseballBall} key={3} />);
      }
      if (thePark.attributes.SOCCER === "Yes") {
        listOfSports.push(<FontAwesomeIcon icon={faFutbol} key={4} />);
      }
      let parkImg = "park" + [Math.floor(Math.random() * 10)] + ".jpg";

      return (
        <div className="event-page">
          <div
            className="container-fluid event-page-heading"
            style={{
              backgroundImage: "url(" + images[parkImg] + ")"
            }}
          ></div>
          <div className="container d-flex flex-column">
            <div className="row">
              <div className="col-12">
                <h1>{thePark.attributes.NAME}</h1>
              </div>
              <div className="col-12 col-md-6">
                <h3 className="tagline">
                  Address: {thePark.attributes.ADDRESS}
                </h3>
                <p>Phone: {thePark.attributes.PHONE}</p>
                <p>
                  {Math.floor(
                    this.props.distanceFunction(
                      this.props.userLocation.latitude,
                      this.props.userLocation.longitude,
                      thePark.attributes.LAT,
                      thePark.attributes.LON,
                      "N"
                    )
                  )}{" "}
                  distance away
                </p>
                <h3>Sports Available</h3>
                <h4>{listOfSports}</h4>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  Update Park
                </button>
              </div>
              <div className="col-12 col-md-6 map">
                <MapComponent
                  lat={thePark.attributes.LAT}
                  lon={thePark.attributes.LON}
                  details={thePark}
                  id="park"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h3>Events</h3>
                {/* <div className="d-flex flex-wrap justify-content-center">
                  <div className="event-card col-12 col-md-5">
                    <div className="event-card-info">
                      <h4 className="title">Create a New Event</h4>
                      <div className="row">
                        <div className="col-12">
                          <FontAwesomeIcon icon={faCalendarPlus} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {this.eventsAtThisPark()}
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Update {thePark.attributes.NAME}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                <form
            className="container"
            onSubmit={e => {
              this.props.submitParkUpdateFunction(
                e,
                this.state.venue,
                this.state.sport,
                this.state.phone,
                this.state.user
              );
            }}
          >
            <br />
           
            <h1>{this.props.message}</h1>
            <label htmlFor="venue">Venue Name</label>
            <input
              className="form-control"
              type="text"
              name="venue"
              onChange={this.handleInput}
              defaultValue={thePark.attributes.NAME}
            />
            <label htmlFor="venue">Venue Address</label>
            <input
              className="form-control"
              type="text"
              name="venue"
              onChange={this.handleInput}
              defaultValue={thePark.attributes.ADDRESS}
            />
            
           
            <label htmlFor="sport">Sport</label>
            <input
              className="form-control"
              type="text"
              name="sport"
              onChange={this.handleInput}
              value={this.state.sport}
            />
           
            <label htmlFor="phone">Phone</label>
            <input
              className="form-control"
              type="text"
              name="phone"
              onChange={this.handleInput}
              defaultValue={thePark.attributes.PHONE}
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
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Submit changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <>Loading</>;
    }
  }
}
export default ParkPage;
