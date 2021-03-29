import * as actionTypes from './actionTypes';

// Starts the main load animation with 4 balls bouncing
export const startLoad = () => {
  return {
    type:actionTypes.START_LOAD
  };
};

// Ends the main load animation with 4 balls bouncing
export const endLoad = () => {
  return {
    type:actionTypes.END_LOAD
  };
};

// Shows response from server error message at the top of the page.
export const showErrorMessage = (errorMessage,errorOther) => {
  let newErrorMsg = '';

  // Taking into account the multiple types of error messages received, which can be a string or an obj literal that contains arrays(like in the case of a error from validation)
  if(errorMessage instanceof Object){
    for(let el in errorMessage){
      for(let i =0 ; i<errorMessage[el].length; i++){
        newErrorMsg += errorMessage[el][i]+' ';
      }
    }
  }else{
    newErrorMsg = errorMessage;
  }

  return {
    type:actionTypes.SHOW_ERROR_MESSAGE,
    errorMessage:newErrorMsg,
    errorOther:errorOther
  };
};

// Removes the error message from the top of the screen, user just has to click on it to do so.
export const removeErrorMessage = () => {
  return {
    type:actionTypes.REMOVE_ERROR_MESSAGE
  };
};

// Show the message received from the backend(if applicable) at the top of the screen
export const showMessage = (message) => {
  return {
    type:actionTypes.SHOW_MESSAGE,
    message:message
  };
};

// Removes the message from the top of the screen, user can click on it to do so
export const removeMessage = () => {
  return {
    type:actionTypes.REMOVE_MESSAGE
  };
};