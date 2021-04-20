import { combineReducers } from 'redux';
import { SET_LOCAL, SET_FETCHED, SET_LOCATIONS } from './actionTypes'
import initialState from './initialState'

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCAL:
      return {
        ...state,
        local: action.payload
      }
    case SET_FETCHED:
      return {
        ...state,
        server: action.payload
      }
    default: 
      return state
  }
}

const locationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      }
    default:
      return state
  }
}

export default combineReducers({
  images: imageReducer,
  locations: locationsReducer
})

