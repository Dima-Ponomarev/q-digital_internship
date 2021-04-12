import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setLocal, setFetched } from '../redux/actions'
import Button from '../components/Button'

export class Slider extends Component {
  state = {
    index: 0,
    imageType: 'local'
  }

  importLocal = (r) => {
    return r.keys().map(r)
  }

  componentDidMount() {
    //getting images from server
    fetch('https://imagesapi.osora.ru/')
      .then(res => res.json())
      .then(data => {
        this.props.setFetched(data)
      })

    //gettin all local jpg images
    const localImages = 
      this.importLocal(require.context('../../img/', false, /\.jpg$/))
      .map(item => item.default)
    this.props.setLocal(localImages)

    this.setState({
      slider: this.props.local
    })
  }

  onNext = () => {
    this.setState({
      index: (this.state.index + 1) % this.state.slider.length
    })
  }

  onPrev = () => {
    if (this.state.index >= 1) {
      this.setState({
        index: this.state.index - 1
      })
    } else {
      this.setState({
        index: this.state.slider.length - 1
      })
    }
  }


  //toggle displayed images
  onSwitch = () => {
    console.log(this.state.imageType)
    if(this.state.imageType === 'local') {
      this.setState({
        imageType: 'server',
        slider: this.props.server
      })
    } else {
      this.setState({
        imageType: 'local',
        slider: this.props.local
      })
    }


    console.log(this.state.imageType)
  }

  render() {
    if (!this.state.slider) {
      this.setState({ slider: this.props.local })
    }
    return (
      <main className='slider'>
        <div className='slider__wrapper'>
          <Button text='prev' onClick={this.onPrev}/>
          {this.state.slider && (
            <img 
              className='slider__image' 
              src={this.state.slider[this.state.index]} 
              alt='slider'/>
          )}
          <Button text='next' onClick={this.onNext}/>
        </div>
        <Button 
          text={this.state.imageType === 'local' ? 'Switch to remote' : 'Switch to local'} 
          onClick={this.onSwitch}/>
        <Button text='back to main' type='link' to='/'/>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  local: state.images.local,
  server: state.images.server
})

export default connect(
  mapStateToProps, 
  { setLocal, setFetched }
)(Slider)