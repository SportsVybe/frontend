import React from 'react'
import Loading from '../Loading/Loading';
import EventCard from '../EventCard/EventCard';
import Axios from 'axios';
import baseURL from '../../services/base';

export default class ShowMyEvents extends React.Component {

    state = {
        myEventsFromDB : [],
        receivedMyEvents: false,
    }

    UNSAFE_componentWillMount(){
        this.getMyEvents()
    }

    getMyEvents = () => {
        //Events from DB
        Axios
          .get(`${baseURL}/api/myevents`, { withCredentials: true })
          // `${baseURL}/api/event}`, { withCredentials: true }
          // https://ironrest.herokuapp.com/avrahm
          .then(res => {
            let x = res.data;
            // console.log(x)
            this.setState({
              myEventsFromDB: x,
              // filteredEvents: x,
              receivedMyEvents: true
            });
          })
          .catch(err => {
            console.log(err);
          });
      }

    showMyEvents = () => {
        // console.log(this.state.myEventsFromDB)
        if (this.state.receivedMyEvents) {
            return this.state.myEventsFromDB.map((eachEvent, i) => {
                return <EventCard eachEvent={eachEvent} key={i} />;
            });
        }
    };

    render() {
        if (this.state.receivedMyEvents) return (
            <>
                {this.showMyEvents()}
            </>
        )
        else return <Loading />;
    }
}
