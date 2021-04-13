import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import Home from './pages/Home'
import ThreeScene from './components/ThreeScene'
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
  componentDidMount() {
    const three = new ThreeScene(this.mount)
    three.init()
  }


  render() {
    return (
      <Provider store={store}>
        <Router> 
          <Switch>
              <Route exact path='/'>
                <div ref={ref => this.mount = ref}></div>
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