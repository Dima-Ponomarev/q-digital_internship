import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import Home from './pages/Home'
import ThreeScene from './components/ThreeScene'
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
                <Slider />
              </Route>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;