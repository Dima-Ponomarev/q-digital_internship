import { SET_LOCAL, SET_FETCHED, SET_LOCATIONS, SET_CURRENT_LOCATION_ID } from './actionTypes'

export function setLocal(images) {
  return {
    type: SET_LOCAL,
    payload: images
  }
}

export function setFetched(images) {
  return {
    type: SET_FETCHED,
    payload: images
  }
}

export function setLocations(data) {
  return {
    type: SET_LOCATIONS,
    payload: data
  }
}

export function setCurrentLocationId(id) {
  return{
    type: SET_CURRENT_LOCATION_ID,
    payload: id
  }
}