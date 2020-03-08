import React, { Component } from "react";
import './Loading.css';

export default class Loading extends Component {
  render() {
    return (
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}
