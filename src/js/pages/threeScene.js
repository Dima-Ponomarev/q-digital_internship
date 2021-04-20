import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setLocations } from '../redux/actions'
import Panorama from '../threejs/index';
import Map from '../components/map'

export class ThreeScene extends Component {
    componentDidMount() {
        fetch('/data.json')
          .then(r => r.json())
          .then(data =>{ 
            new Panorama(data.data, this.mount)      
            this.props.setLocations(data)
          })
      }

  render() {
    return (
      <>
        <div id='canvas' ref={ref => this.mount = ref}></div>
        <Map />
      </>
    )
  }
}

const mapStateToProps = state => ({
  locations: state.locations.locations
})

export default connect(
  null,
  { setLocations }
)(ThreeScene)