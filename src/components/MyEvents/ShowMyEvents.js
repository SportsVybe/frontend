import React from 'react'
import Loading from '../Loading/Loading';
import EventCard from '../EventCard/EventCard';

export default class ShowMyEvents extends React.Component {

    state = {
        myEventsFromDB : this.props.myEventsFromDB || []
    }

 componentWillUpdate() {
        // if(!this.props.myEventsFromDB){
            // this.props.getMyEvents()
        // }
    }

    showMyEvents = () => {
        console.log(this.state.myEventsFromDB)
        if (this.props.ready) {
            return this.state.myEventsFromDB.map((eachEvent, i) => {
                return <EventCard eachEvent={eachEvent} key={i} />;
            });
        }
    };

    render() {
        if (this.props.ready) return (
            <>
                {this.showMyEvents()}
            </>
        )
        else return <Loading />;
    }
}
