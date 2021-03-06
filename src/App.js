import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Axios from "axios";
import { myHistory } from "./index.js";
import baseURL from "./services/base";
import actions from "./services/index";
import "./services/googleapi";
import moment from "moment";

//css
import "bootstrap/dist/css/bootstrap.min.css";

//Components
// import Loading from "./components/Loading/Loading";
import Profile from "./components/Profile/Profile";
import ListOfParks from "./components/ListOfParks/ListOfParks";
import ListOfEvents from "./components/ListOfEvents/ListOfEvents";
import SinglePark from "./components/SinglePark/SinglePark";
import AddNewEvent from "./components/AddNewEvent/AddNewEvent";
import SingleEvent from "./components/SingleEvent/SingleEvent";
import SearchMap from "./components/Map/SearchMap";
import Navbar from "./components/Navbar/Navbar";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";



class App extends Component {
  state = {
    theParksFromMiamiDade: null,
    eventsFromDB: null,
    venuesFromDB: null,
    apiIsAwake: false,
    errorMsg: null,
    successMsg: null,
    userLoggedIn: null,
    filteredEvents: [],
    filteredParks: [],
    userLocation: {
      latitude: 0,
      longitude: 0
    },
    redirect: true,
    redirectCount: 0,
    basketball: true,
    soccer: false,
    yoga: false,
    selectedOption: "all",
  };

  async componentDidMount() {
    this.getUser();
    this.fetchData();
  }

  fetchData = () => {
    //Miami Dade Parks and Recs JSON API
    Axios
      .get(
        "https://gisweb.miamidade.gov/arcgis/rest/services/Parks/MD_Parks305/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      )
      .then(theResults => {
        let x = theResults.data.features;
        this.setState({
          theParksFromMiamiDade: x,
          filteredParks: x,
          apiIsAwake: true
        });
      })
      .catch(err => {
        console.log(err);
      });

    //Events from DB
    Axios
      .get(`${baseURL}/api/events`, { withCredentials: true })
      .then(res => {
        let x = res.data;
        // console.log(x)
        this.setState({
          eventsFromDB: x,
          filteredEvents: x,
          apiIsAwake: true
        });
      })
      .catch(err => {
        console.log(err);
      });

    //Venues from DB
    Axios
      .get(`${baseURL}/api/venues`, { withCredentials: true })
      .then(res => {
        let x = res.data;
        // console.log(x)
        this.setState({
          venuesFromDB: x,
          // filteredvenues: x,
          // apiIsAwake: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getUserLocation = () => {
    let geo_success = position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
    };

    let geo_error = () => {
      console.log("Sorry, no position available.");
    };

    let geo_options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 7000
    };

    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
  }

  /** save the user data to the state */
  setUser = userObj => {
    this.setState({
      userLoggedIn: userObj,
      redirect: false
    });
  };

  /** make call to server to get the user data and save to set state */
  getUser = () => {
    actions.isLoggedIn()
      .then(res => {
        // if there is a user logged in then fetch the user data and set the state
        if (res.data) {
          this.setUser(res.data);
          this.getUserLocation();
          this.setFeedbackMessage(`${res.data.username} successfully logged in`, true);
          setTimeout(() => {
            this.setState({ apiIsAwake: true, redirect: false });
          }, 2000);
        }
        else {
          this.setFeedbackMessage(`No user is currently logged in`, false);
          setTimeout(() => {
            this.setState({ apiIsAwake: true });
          }, 2000);
        }
        this.setState({ apiIsAwake: true });
      })
      .catch(err => {
        this.setFeedbackMessage(
          `Failed to verify if there is a user logged in. Error: ${err}`,
          false
        );
        this.setState({ redirect: true })
      });
  };

  checkIfUser = () => {
    if (this.state.userLoggedIn && !this.state.redirect && this.state.redirectCount === 0) {
      this.setState({ redirectCount: 1 })
      return myHistory.push("/profile/");
    } else if (this.state.redirect) {
      myHistory.push("/login/")
    }
  };

  /** logout the user from the backend and delete all user data from state */
  logout = () => {
    Axios.get(`${baseURL}/api/logout`, { withCredentials: true })
      .then(res => {
        this.setUser(null);
        // this.setState({
        //   listOfTasks: [],
        //   filterTaskList: [],
        //   taskDataIsReady: false
        // });
        localStorage.removeItem('user');
        this.setFeedbackMessage(`${res.data.message}`, true);
      })
      .catch(err => {
        this.setFeedbackMessage(`Failed to logout user. Error: ${err}`, false);
      });
  };

  formatDate = (date) => {
    return moment(date).format('dddd, MMMM Do, YYYY');
  }

  formatTime = (time) => {
    return moment(time).format('h:mm A');
  }

  distanceFunction = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") { dist = dist * 1.609344 }
      if (unit === "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  filterFunction = e => {
    let parksFiltered;
    let eventsFiltered;
    let sportButton = e.target.id.toUpperCase();
    // console.log(sportButton)
    //if target checked is true then filter parks by sport with the target name (ie. basketball, soccer, etc)
    if (e.target.id === "all") {
      this.setState({
        filteredParks: this.state.theParksFromMiamiDade,
        filteredEvents: this.state.eventsFromDB,
        selectedOption: e.target.id
      });
    } else if (e.target.checked === true) {
      parksFiltered = this.state.theParksFromMiamiDade.filter(
        res => res.attributes[sportButton] === "Yes"
      );
      eventsFiltered = this.state.eventsFromDB.filter(
        res => res.sport.toLowerCase() === e.target.id
      );
      this.setState({
        filteredParks: parksFiltered,
        filteredEvents: eventsFiltered,
        selectedOption: e.target.id
      });
      // console.log(this.state.parks)
    } else {
      this.setState({
        filteredParks: this.state.theParksFromMiamiDade,
        filteredEvents: this.state.eventsFromDB,
        selectedOption: "all"
      });
    }
  };

  setFeedbackMessage = (message, itIsSuccess) => {
    if (itIsSuccess) {
      this.setState({
        successMsg: message
      });
    } else {
      this.setState({
        errorMsg: message
      });
    }

    // only display message for x amount of time
    setTimeout(() => {
      this.setState({
        errorMsg: null,
        successMsg: null
      });
    }, 3000);
  };

  render() {
    if (this.state.apiIsAwake) {
      return (
        <div className="App">
          <Navbar
            {...this.props}
            userObj={this.state.userLoggedIn}
            logout={this.logout}
            setUser={this.setUser}
            fetchData={this.fetchData}
            setFlashMessage={this.setFeedbackMessage}
          />
          {/* <SignIn /> */}
          {/* <Header /> */}
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  {...props}
                  listOfParks={this.state.theParksFromMiamiDade}
                />)} />
            <Route
              exact
              path="/signup/"
              render={props => (
                <SignUp
                  {...props}
                  ready={this.state.apiIsAwake}
                  userObj={this.state.userLoggedIn}
                  setUser={this.setUser}
                  // fetchData={this.fetchData}
                  setFlashMessage={this.setFeedbackMessage}
                />
              )}
            />
            <Route
              exact
              path="/login/"
              render={props => (
                <Login
                  {...props}
                  ready={this.state.apiIsAwake}
                  userObj={this.state.userLoggedIn}
                  setUser={this.setUser}
                  setFlashMessage={this.setFeedbackMessage}
                />
              )}
            />
            <Route
              exact
              path="/map/"
              render={props => (
                <SearchMap
                  {...props}
                  parkData={this.state.filteredParks}
                  eventData={this.state.filteredEvents}
                  filterFunction={this.filterFunction}
                  selectedOption={this.state.selectedOption}
                  ready={this.state.apiIsAwake}
                  userLocation={this.state.userLocation}
                />
              )}
            />

            <Route
              exact
              path="/singlepark/:id"
              render={props => (
                <SinglePark
                  {...props}
                  listOfParks={this.state.theParksFromMiamiDade}
                  listOfEvents={this.state.eventsFromDB}
                  ready={this.state.apiIsAwake}
                  userLocation={this.state.userLocation}
                  distanceFunction={this.distanceFunction}
                  submitParkUpdateFunction={this.submitParkUpdateFunction}
                  message={this.state.message}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/parks/"
              render={props => (
                <ListOfParks
                  {...props}
                  listOfParks={this.state.filteredParks}
                  ready={this.state.apiIsAwake}
                  filterFunction={this.filterFunction}
                  selectedOption={this.state.selectedOption}
                  userLocation={this.state.userLocation}
                  distanceFunction={this.distanceFunction}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/events/"
              render={props => (
                <ListOfEvents
                  {...props}
                  listOfEvents={this.state.filteredEvents}
                  ready={this.state.apiIsAwake}
                  filterFunction={this.filterFunction}
                  selectedOption={this.state.selectedOption}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/profile/"
              render={props => (
                <Profile
                  {...props}
                  checkIfUser={this.checkIfUser}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/myevents/"
              render={props => (
                <Profile
                  {...props}
                  checkIfUser={this.checkIfUser}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/singleevent/:id"
              render={props => (
                <SingleEvent
                  {...props}
                  listOfEvents={this.state.eventsFromDB}
                  ready={this.state.apiIsAwake}
                  message={this.state.message}
                  formatDate={this.formatDate}
                  formatTime={this.formatTime}
                />
              )}
            />
            <Route
              exact
              path="/newevent/"
              render={props => (
                <AddNewEvent
                  {...props}
                  checkIfUser={this.checkIfUser}
                  listOfParks={this.state.theParksFromMiamiDade}
                  listOfVenuesFromDB={this.state.venuesFromDB}
                  // message={this.state.message}
                  // createNewEvent={this.createNewEvent}
                  setFlashMessage={this.setFeedbackMessage}
                  setUser={this.state.setUser}
                  userObj={this.state.userObj}
                  fetchData={this.fetchData}
                />
              )}
            />
          </Switch>
          {this.state.successMsg && (
            <div className="alert alert-success" role="alert">
              {this.state.successMsg}
            </div>
          )}

          {this.state.errorMsg && (
            <div className="alert alert-danger" role="alert">
              {this.state.errorMsg}
            </div>
          )}
        </div>
      );
    }
    else {
      return <>Loading</>;
    }
  }
}

export default App;
