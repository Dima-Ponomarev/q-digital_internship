import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import ThreePanorama from './components/ThreePanorama'
import Slider from './pages/Slider'
import Redux from './redux/index'
import { createStore } from 'redux';

const store = createStore(
  Redux.Reducers, 
  Redux.InitialState, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export class App extends Component {
  componentDidMount() {
    new ThreePanorama(this.mount)
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