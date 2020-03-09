import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Navbar extends Component {
    state = {
        active: null,
    }

    activeLink = (x) => {
        this.setState({
            active: x,
        })
    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg fixed navbar-light bg-light">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" to="/">SportsVybe</Link>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link className={this.state.active === "map" ? ("nav-link active") : ("nav-link")} to="/map/" onClick={() => { this.activeLink("map") }}>Map </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={this.state.active === "events" ? ("nav-link active") : ("nav-link")} to="/events/" onClick={() => { this.activeLink("events") }}>Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={this.state.active === "parks" ? ("nav-link active") : ("nav-link")} to="/parks/" onClick={() => { this.activeLink("parks") }}>Parks</Link>
                            </li>
                        </ul>
                        {this.props.userObj ? (
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                <li className="nav-item"><Link to="/newevent/" className={this.state.active === "newevent" ? ("btn btn-success my-2 my-sm-0") : ("btn btn-outline-success my-2 my-sm-0")} onClick={() => { this.activeLink("newevent") }}>Add New Event</Link>
                                </li>
                                <li className="nav-item"><Link to="/profile/" className={this.state.active === "profile" ? ("nav-link active") : ("nav-link")} onClick={() => { this.activeLink("profile") }}>Profile</Link>
                                </li>
                                <li className="nav-item"><Link to="/myevents/" className={this.state.active === "myevents" ? ("nav-link active") : ("nav-link")} onClick={() => { this.activeLink("myevents") }}>My Events</Link>
                                </li>
                                <li className="nav-item"><Link to="/" onClick={this.props.logout} className="nav-link">Logout</Link>
                                </li>
                            </ul>
                        ) : (
                                <div>
                                    <Link to="/signup/" className={this.state.active === "signup" ? ("btn btn-success my-2 my-sm-0") : ("btn btn-outline-success my-2 my-sm-0")} onClick={() => { this.activeLink("signup") }}>SignUp/Login</Link>
                                </div>)}
                    </div>
                </nav>
            </div>
        )
    }
}
