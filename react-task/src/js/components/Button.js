import React, { Component } from 'react'
import '../../scss/components/button.scss'

export class Button extends Component {
  render() {
    return (
      <button className='button'>
        {this.props.text}
      </button>
    )
  }
}

export default Button
