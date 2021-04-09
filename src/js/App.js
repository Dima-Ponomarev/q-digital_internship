import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import Home from './pages/Home'
import Redux from './redux/index'
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'

const middleware = [thunk]

const store = createStore(
  Redux.Reducers, 
  Redux.InitialState, 
  applyMiddleware(...middleware)
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
              </Route>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;