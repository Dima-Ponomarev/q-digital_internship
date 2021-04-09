import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import '../scss/app.scss'

export class App extends Component {
  render() {
    return (
      <Router> 
        <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/slider'>
            </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;