import { SET_LOCAL, SET_FETCHED, SET_LOCATIONS } from './actionTypes'

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