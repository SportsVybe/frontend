import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Navbar extends Component {
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
                            <li className="nav-item active">
                                <Link className="nav-link" to="/map/">Map <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/events/">Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/parks/">Parks</Link>
                            </li>
                        </ul>
                        {this.props.userObj ? (
                        <div>
                            <Link to="/newevent/" className="btn btn-outline-success my-2 my-sm-0" >Add New Event</Link>  
                            <Link to="/myevents/">My Events</Link>
                            <Link to="/" onClick={this.props.logout}>Logout</Link>
                        </div>
                        ) : (
                                <div>
                                    <Link to="/signup/" className="btn btn-outline-success my-2 my-sm-0" >SignUp/Login</Link>
                                </div>)}
                    </div>
                </nav>
            </div>
        )
    }
}
