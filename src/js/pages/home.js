import React, { Component } from 'react'
import Button from '../components/Button'


export class Home extends Component {
  render() {
    return (
      <main className='home'>
        <h2 className='home__greet'>Greetings!</h2>
        <Button 
          text='Slider' 
          type='link' 
          to='/slider' />
      </main>
    )
  }
}

export default Home
