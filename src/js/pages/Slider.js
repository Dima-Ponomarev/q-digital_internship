import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchImages } from '../redux/actions'
import Button from '../components/Button'

export class Slider extends Component {
  state = {
    index: 0
  }

  componentDidMount() {
    fetch('https://imagesapi.osora.ru/')
      .then(res => res.json())
      .then(data => this.props.fetchImages(data))
  }

  onNext = () => {
    this.setState({
      index: (this.state.index + 1) % this.props.images.length
    })
  }

  onPrev = () => {
    if (this.state.index >= 1) {
      this.setState({
        index: this.state.index - 1
      })
    } else {
      this.setState({
        index: this.props.images.length - 1
      })
    }
  }

  render() {
    return (
      <main className='slider'>
        <div className='slider__wrapper'>
          <Button text='prev' onChange={this.onPrev}/>
          {this.props.images 
          && (
            <img className='slider__image' src={this.props.images[this.state.index]} alt='slider'/>
          )}
          <Button text='next' onChange={this.onNext}/>
        </div>
        <Button text='switch to local'/>
        <Button text='back to main' type='link' to='/'/>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  images: state.images.images
})

export default connect(mapStateToProps, { fetchImages })(Slider)