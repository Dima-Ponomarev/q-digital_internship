import React, { Component } from 'react'
import { Link } from "react-router-dom";
import '../../scss/components/home.scss'
import Button from '../components/Button'



export class Home extends Component {
  render() {
    return (
      <main className='home'>
        <h2 className='home__greet'>Greetings!</h2>
        <Link className='home__slider-btn' to='/slider'>
          <Button text='Slider'/>
        </Link>
      </main>
    )
  }
}

export default Home
