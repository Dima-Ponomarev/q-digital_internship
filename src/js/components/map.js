import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Map extends Component {
  componentDidMount(){
    console.log(this.props)
  }

  render() {
    return (
      <div className='map'>
          <div className='map__container'>
            {this.props.locations &&
              this.props.locations.data.map(location => (
                <div 
                  key={location.id} 
                  // className={location.id === panorama.currentLocation.id 
                  // ? 'map__dot map__dot--active'
                  // : 'map__dot'}
                  className='map__dot'
                  style={{top:`${location.coords.z * 1.5 + 50}%`,
                          left: `${location.coords.x * 20 + 50}%`}}>
                </div>
              ))
            }
          </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  locations: state.locations.locations
})


export default connect(
  mapStateToProps,
  null)(Map)
