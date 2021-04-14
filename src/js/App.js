import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import Slider from './pages/slider'
import Redux from './redux/index'
import { createStore } from 'redux';
import Panorama from './threejs/index';

const store = createStore(
  Redux.Reducers, 
  Redux.InitialState, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export class App extends Component {
  componentDidMount() {
    fetch('/data.json')
      .then(r => r.json())
      .then(data => new Panorama(data.data, this.mount))
  }


  render() {
    return (
      <Provider store={store}>
        <Router> 
          <Switch>
              <Route exact path='/'>
                <div className='canvas' ref={ref => this.mount = ref}></div>
              </Route>
              <Route path='/slider'>
                <Slider />
              </Route>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;