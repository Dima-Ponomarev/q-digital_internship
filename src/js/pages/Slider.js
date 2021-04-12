import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchImages } from '../redux/actions'

export class Slider extends Component {
  componentWillMount() {
    fetch('https://imagesapi.osora.ru/')
      .then(res => res.json())
      .then(data => this.props.fetchImages(data))
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

const mapStateToProps = state => ({
  images: state.images.images
})

export default connect(mapStateToProps, { fetchImages })(Slider)
