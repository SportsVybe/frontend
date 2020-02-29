import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import actions from "../../services/index";

export default class SignUp extends Component {

    state = {};
    handleInput = e => this.setState({ [e.target.name]: e.target.value });

    handleFormSubmit = event => {
        event.preventDefault();

        if (this.state.email) {
            let user = {
                email: this.state.email,
                password: this.state.password
            };
            
            actions
                .logIn(user)
                .then(response => {
                    this.setState({
                        email: "",
                        password: ""
                    });
                    this.props.setUser(response.data);
                    // this.props.getMyEvents();
                    this.props.history.push("/myevents/");
                    this.props.setFlashMessage("Login successful", true);
                })
                .catch(err => {
                    // console.log(err);
                });
        } else {
            this.props.setFlashMessage("Please input both email and password", false);
        }
    };

    render() {
        return (
            <div className="login">
                <form className="login-menu" onSubmit={this.handleFormSubmit}>
                    <h1>Login</h1>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input className="form-control" onChange={this.handleInput} id="email" name="email" type="email" defaultValue={this.state.email} />

                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input className="form-control" onChange={this.handleInput} id="password" name="password" type="password" defaultValue={this.state.password} />

                    </div>

                    {/* <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div> */}

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                    <div>
                        Don't have an account? <Link to="/signup/">Sign up</Link>
                    </div>

                </form>


            </div>
        )
    }
}