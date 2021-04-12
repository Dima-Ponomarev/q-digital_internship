import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Button extends Component {
  render() {
    if (this.props.type === 'link'){
      return (
        <Link className='button button_link' to={this.props.to}>
          {this.props.text}
        </Link>
      )
    }
    return (
      <div className='button' onClick={this.props.onChange}>
        {this.props.text}
      </div>
    )
  }
}

export default Button
