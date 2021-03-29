import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';
import * as actions from './index';
import * as globalVariables from '../../globalVariables';
import beforeunloadRequest from 'beforeunload-request';

// The authentication process is token based and it also has a refresh token. The token expires after 1 hour and the refresh token after 2 weeks. 
// The refresh token is used to retrieve a new token(and refresh token). While active on the app page and logged in, this process is done automatically with the help of a timer(check setAuthTimeout for more info)
// The token is sent with each request to the backend in order to determine if the user is authorized to make one of the CRUD operations.

// Action creator used to store auth info in the redux store, triggered after a successfull authentication.
const auth = (userId,token,refresh_token,verified) => {
  return {
    type:actionTypes.AUTH,
    userId:userId,
    token:token,
    refresh_token:refresh_token,
    verified:verified
  };
};

// Action creator used make a request, to the backend in order to authenticate the user. Payload contains the email and password.
export const login = (payload) => {
  return dispatch => {
    dispatch(actions.startLoad());
    axios({
      method:'post',
      url:'/login',
      data:payload
    }).then(res=>{
      saveTokenToCache(res.data.info);
      clearTimeout(window.myTimerChat4fun);
      dispatch(setAuthTimeout(res.data.info.expiry_token,res.data.info.refresh_token));
      dispatch(auth(res.data.info.user_id,res.data.info.token,res.data.info.refresh_token,true));
      dispatch(getInformation(res.data.info.user_id,res.data.info.token));
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;
    
      dispatch(actions.showErrorMessage(error,err.response.data.info ? err.response.data.info.link : null));
      dispatch(actions.endLoad());
    })
  };
};

// Method used to send a request to the backend in order to create a new account. If successfull the user is informed that he will have to verify his email address in order to access the app. 
export const register = (payload) => {
  return dispatch => {
    dispatch(actions.startLoad());
    var form = new FormData();
    for(let el in payload){
      if(payload[el]){
        form.append(el,payload[el]);
      }
    }

    axios({
      method:'post',
      url:'/user',
      data:form,
      headers:{
        'Content-type':'multipart/form-data'
      }
    }).then(res => {
      dispatch(actions.showMessage(res.data.message));
      dispatch(actions.endLoad());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(actions.endLoad());
    })
  };
};

// Action creator used to dispatch action that retrieves a new token with the help of the refresh token. This is done with a timer set to trigger the action 50 minutes after the token was retrieved(10 min before it expires).
const setAuthTimeout = (tokenExpirationTime,refresh_token) => {
  return dispatch => {
    window.myTimerChat4fun = setTimeout(()=>{
      dispatch(refreshToken(refresh_token));
    }, parseInt(tokenExpirationTime - 600) * 1000);
  };
};

// Action creator used to make a request that has the refresh token in the authorization header. This is only done at the '/refreshToken' endpoint, anywhere else the token is required. The purpose is to retrieve a new token.
const refreshToken = (refresh_token, getInfo = false) => {
  return dispatch => {
    axios({
      method:'get',
      url:'/refreshToken',
      headers: {
        Authorization: `Bearer ${refresh_token}`
      }
    }).then(res => {
      saveTokenToCache(res.data.info);
      clearTimeout(window.myTimerChat4fun);
      dispatch(setAuthTimeout(res.data.info.expiry_token,res.data.info.refresh_token));
      dispatch(auth(res.data.info.user_id,res.data.info.token,res.data.info.refresh_token,true));

      if(getInfo){
        dispatch(getInformation(res.data.info.user_id,res.data.info.token));
      }
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(logout());
      dispatch(actions.clearInfo());
      dispatch(actions.clearMessages());
      
      if(window.myPusher){
        dispatch(actions.clearPusher());
      }
      
      dispatch(actions.endLoad());
    })
  };
};

// Action creator used when the app first opens or when reloading the page. It checks if there is a token, if there is one then it checks if it is expired. If it's not expired then the auth info is stored and the necessary info is retrieved using the token in question. If the token is expired then the refresh token is used to retrieve a new token, if the refresh token isn't expired then it will be used to get a new token and if it's expired message will be displayed showing this.
export const authCheckState = () => {
  return dispatch => {
    dispatch(actions.startLoad());

    const token = localStorage.getItem('token');
    
    if(token){
      const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');

      if((tokenExpirationDate - 700000) > new Date().getTime()){
        const refresh_token = localStorage.getItem('refresh_token');
        const userId = localStorage.getItem('userId');

        dispatch(auth(userId,token,refresh_token,true));
        clearTimeout(window.myTimerChat4fun);
        dispatch(setAuthTimeout((tokenExpirationDate - new Date().getTime())/1000,refresh_token));
        dispatch(getInformation(userId,token));
      }else{
        const refresh_token = localStorage.getItem('refresh_token');
        
        if(refresh_token){
          dispatch(refreshToken(refresh_token,true));
        }else{
          dispatch(logout());
          dispatch(actions.endLoad());
        }
      }
    }else{
      dispatch(logout());
      dispatch(actions.endLoad());
    }
  };
};

// Action creator used to reset the auth info in the redux store and remove it from the local storage.
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpirationDate');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('refreshTokenExpirationDate');
  localStorage.removeItem('userId');

  clearTimeout(window.myTimerChat4fun);
  return {
    type:actionTypes.LOGOUT
  };
};

// Action creator used to make a request to logout the user from app, deleting the token from the db and showing the user offline to all his contacts.
export const logoutFromApp = (token) => {
  return dispatch => {
    dispatch(actions.startLoad());
   
    axios({
      method:'delete',
      url:'/logout',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      // After the user is logged out all the redux store info is reset.
      dispatch(logout());
      dispatch(actions.clearInfo());
      dispatch(actions.clearMessages());
      dispatch(actions.clearPusher());
      dispatch(actions.endLoad());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(actions.endLoad());
    })
  };
};

// Actions creator used to store auth info in local storage
const saveTokenToCache = (data) => {
  // The expiry time is calculated in miliseconds passed since midnight of January 1, 1970
  const tokenExpirationDate = new Date().getTime() + data.expiry_token * 1000;
  const refreshTokenExpirationDate = new Date().getTime() + data.expiry_refresh_token * 1000;

  localStorage.setItem('token',data.token);
  localStorage.setItem('tokenExpirationDate',tokenExpirationDate);
  localStorage.setItem('refresh_token',data.refresh_token);
  localStorage.setItem('refreshTokenExpirationDate',refreshTokenExpirationDate);
  localStorage.setItem('userId',data.user_id);
}

// When logging in the user can get certain error messages that contain links(ex: accessing the account without verifying the email address). This action creator is used to make request to that link(endpoint) to resolve the issue(ex: send another email for verification)
export const handleLogInErrorLinks = () => {
  return (dispatch,getState) => {
    dispatch(actions.startLoad());

    const path = getState().app.error.other.split('user')[1];

    axios({
      method:'get',
      url:`/user${path}`
    }).then(res => {
      dispatch(actions.showMessage(res.data.message));
      dispatch(actions.endLoad());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error));
      dispatch(actions.endLoad());
    })
  };
};

// Action creator used to dispatch the action that retrieves info about the user, this is the first part of the information chain that is being retrieved from the server.
const getInformation = (userId,token) => {
  return dispatch => {
    dispatch(actions.getMainUserInfo(userId,token));
  };
};

// Makes a request to the enpoint `/online` that makes the user appear online to his contacts
export const showOnline = (token) => {
  return dispatch => {
    axios({
      method:'get',
      url:`/online`,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      dispatch(actions.endLoad());
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;
  
      dispatch(actions.showErrorMessage(error));
      dispatch(actions.endLoad());
    });
  };
};

// Makes a request to the enpoint `/offline` that makes the user appear offline to his contacts. This is done in 2 ways: sync and async. Async is done when changing page visibility and sync is done when closing the tab(or refreshing the page).
export const showOffline = (token,async) => {
  return dispatch => {
    if(async){
      axios({
        method:'get',
        url:'/offline',
        headers:{
          Authorization: `Bearer ${token}`
        }
      }).then(err => {}).catch(err => {
        let error = err.response ? err.response.data.error : err.message;
    
        dispatch(actions.showErrorMessage(error));
      })
    }else{
      beforeunloadRequest(`${globalVariables.url}offline`, {
        method:'GET',
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
    }
  };
};

// Makes request to endpoint '/active', makes the user active on a certain chat with a contact
export const showActive = (token,userId) => {
  return dispatch => {
    axios({
      method:'post',
      url:'/active',
      data:{
        user_id: userId
      },
      headers:{
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res => {}).catch(err => {
      let error = err.response ? err.response.data.error : err.message;
  
      dispatch(actions.showErrorMessage(error));
    })
  };
};

// Makes request to endpoint '/inactive', makes the user inactive on a certain chat with a contact
export const showInactive = (token,userId) => {
  return dispatch => {
    axios({
      method:'post',
      url:'/inactive',
      data:{
        user_id: userId
      },
      headers:{
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res => {}).catch(err => {
      let error = err.response ? err.response.data.error : err.message;
  
      dispatch(actions.showErrorMessage(error));
    })
  }
}

// Makes a request to endpoint `user/{mainUserId}` in order to deactivate the account.
export const deactivateAccount = (token,mainUserId) => {
  return dispatch => {
    dispatch(actions.startLoad());

    axios({
      method:'delete',
      url:`user/${mainUserId}`,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      dispatch(logout());
      dispatch(actions.clearInfo());
      dispatch(actions.clearMessages());
      dispatch(actions.clearPusher());
      dispatch(actions.showMessage(res.data.message));
      dispatch(actions.endLoad());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;
  
      dispatch(actions.showErrorMessage(error));
      dispatch(actions.endLoad());
    })
  };
};



