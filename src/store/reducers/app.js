import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading:false,
  error:{
    message: '',
    other:null
  },
  message:null
}

const reducer = (state=initialState,action) => {
  switch(action.type){
    case actionTypes.START_LOAD:
      return {
        ...state,
        loading:true
      }
    case actionTypes.END_LOAD:
      return {
        ...state,
        loading:false
      }
    case actionTypes.SHOW_ERROR_MESSAGE:
      let newErrorMsg = ``;
      if(state.error.message){
        newErrorMsg =`${state.error.message}. ${action.errorMessage}`;
      }else{
        newErrorMsg = action.errorMessage;
      }
      
      return {
        ...state,
        error:{
          message:newErrorMsg,
          other:action.errorOther
        }
      }
    case actionTypes.REMOVE_ERROR_MESSAGE:
      return {
        ...state,
        error:{
          message:null,
          other:null
        }
      }
    case actionTypes.SHOW_MESSAGE:
      return {
        ...state,
        message:action.message
      }
    case actionTypes.REMOVE_MESSAGE:
      return {
        ...state,
        message:null
      }
    default:
      return state;
  }
}

export default reducer;