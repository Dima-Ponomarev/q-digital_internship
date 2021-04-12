import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import Home from './pages/Home'
import Slider from './pages/Slider'
import Redux from './redux/index'
import { createStore } from 'redux';

const store = createStore(
  Redux.Reducers, 
  Redux.InitialState, 
)

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router> 
          <Switch>
              <Route exact path='/'>
                <Home />
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