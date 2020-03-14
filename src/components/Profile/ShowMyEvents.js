import React from 'react';
// import Loading from '../Loading/Loading';
import EventCard from '../EventCard/EventCard';
import Axios from 'axios';
import baseURL from '../../services/base';

export default class ShowMyEvents extends React.Component {

    state = {
        myEventsFromDB: [],
        receivedMyEvents: false,
    }

    componentWillMount() {
        this.getMyEvents()
    }

    getMyEvents = () => {
        //Events from DB
        Axios
            .get(`${baseURL}/api/myevents`, { withCredentials: true })
            .then(res => {
                let x = res.data;
                this.setState({
                    myEventsFromDB: x,
                    receivedMyEvents: true
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    showMyEvents = () => {
        if (this.state.receivedMyEvents) {
            return this.state.myEventsFromDB.map((eachEvent, i) => {
                return <EventCard formatDate={this.props.formatDate} formatTime={this.props.formatTime} eachEvent={eachEvent} key={i} />;
            });
        }
    };

    render() {
        if (this.state.receivedMyEvents) return (
            <>
                {this.showMyEvents()}
            </>
        )
        else return <>Loading your events</>;
    }
}
