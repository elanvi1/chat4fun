import * as actionTypes from '../actions/actionTypes';

const initialState ={
  userId:'',
  token: '',
  refresh_token:'',
  verified: true
}

const reducer = (state=initialState,action) => {
  switch(action.type){
    case actionTypes.AUTH:
      return {
        ...state,
        token:action.token,
        userId:action.userId,
        refresh_token:action.refresh_token,
        verified: action.verified
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        userId:'',
        token: '',
        refresh_token:'',
        verified: true
      }
    default:
      return state;
  }
};

export default reducer;