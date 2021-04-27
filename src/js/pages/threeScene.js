import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setLocations, setCurrentLocationId } from '../redux/actions'
import Panorama from '../threejs/index';
import Map from '../components/map'

export class ThreeScene extends Component {
  componentDidMount() {
      fetch('/data.json')
        .then(r => r.json())
        .then(data =>{ 
          this.panorama = new Panorama(data.data, this.mount, this.props.setCurrentLocationId) 
          this.forceUpdate()
          this.props.setLocations(data)
        })
  }

  render() {
    return (
      <>
        <div id='canvas' ref={ref => this.mount = ref}></div>
        {this.panorama && <Map onDotClick={this.panorama.renderNextLocation}/>}
      </>
    )
  }
}

export default connect(
  null,
  { setLocations, setCurrentLocationId }
)(ThreeScene)