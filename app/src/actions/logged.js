import { LOG_IN, LOG_OUT, REGISTER, EAT_SNACK, CREATE_GROUP } from '../constants/ActionTypes'

export const logIn = (data) => {
  return { type: LOG_IN, data }
}

export const logOut = () => {
  return { type: LOG_OUT }
}

export const register = (data) => {
  return { type: REGISTER, data }
}

export const eatSnack = () => {
  return { type: EAT_SNACK }
}

export const createGroup = (data) => {
  return {type: CREATE_GROUP, data}
}
