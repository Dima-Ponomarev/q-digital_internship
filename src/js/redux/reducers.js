import { combineReducers } from 'redux';
import { FETCH_IMAGES } from './actionTypes'
import initialState from './initialState'

const imageReducer = ( state = initialState, action ) => {
  switch (action.type) {
    case FETCH_IMAGES:
      return {
        ...state,
        images: action.payload
      }
    default: 
      return state
  }
}

export default combineReducers({
  images: imageReducer
})

