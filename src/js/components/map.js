import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Map extends Component {
  // shouldComponentUpdate(nextProps){
  //   if (this.props.currentLocationId !== nextProps.currentLocationId){
  //     return true
  //   }
  //   return false
  // }
  state = {
    isMapOpened: false
  }

  componentDidUpdate(){
    console.log(this.props)
  }

  onClick = () => {
    this.setState({isMapOpened: !this.state.isMapOpened})
  }

  onDotClick = id => {
    if (this.state.isMapOpened){
      this.props.onDotClick(id, false)
    }
  }

  render() {
    const { currentLocationId } = this.props
    return (
      <div className={this.state.isMapOpened ? 'map map--active' : 'map'} onClick={this.onClick}>
          <div className='map__container' onClick={this.onClick}>
            {this.props.locations &&
              this.props.locations.data.map(location => (
                <div 
                  key={location.id} 
                  className={location.id === currentLocationId ? 'map__dot map__dot--active' : 'map__dot'}
                  
                  style={{top:`${location.coords.z * 2 + 50}%`,
                          left: `${location.coords.x * 20 + 50}%`}}
                  onClick={() => this.onDotClick(location.id)}>
                </div>
              ))
            }
          </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  locations: state.locations.locations,
  currentLocationId: state.locations.currentLocationId
})


export default connect(
  mapStateToProps,
  null
)(Map)
