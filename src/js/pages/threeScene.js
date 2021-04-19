import React, { Component } from 'react'
import Panorama from '../threejs/index';

export class ThreeScene extends Component {
    componentDidMount() {
        fetch('/data.json')
          .then(r => r.json())
          .then(data =>{ 
            new Panorama(data.data, this.mount)           
          })
      }

  render() {
    return (
      <>
        <div id='canvas' ref={ref => this.mount = ref}></div>
        <div className='modal-map'></div>  
      </>
    )
  }
}

export default ThreeScene
