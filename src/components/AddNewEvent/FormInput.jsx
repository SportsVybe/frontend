import React, { Component } from "react";

export default class FormInput extends Component {
  render() {
    //   console.log(this.props.defaultValue)
    if(this.props.type==="textarea")  {
      return (<div>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <textarea
          className="form-control"
          type={this.props.type}
          name={this.props.name}
          onChange={this.props.handleInput}
          defaultValue={this.props.defaultValue}
        ></textarea>
      </div>) } else if(this.props.type==="hidden")  {
    return (<div>
      <input
        className="form-control"
        type={this.props.type}
        name={this.props.name}
        onChange={this.props.handleInput}
        defaultValue={this.props.defaultValue}
      />
    </div>) } else
    {return (
      <div>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input
          className="form-control"
          type={this.props.type}
          name={this.props.name}
          onChange={this.props.handleInput}
          defaultValue={this.props.defaultValue}
        />
      </div>
    )};
  }
}
