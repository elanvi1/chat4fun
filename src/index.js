import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers, createStore,applyMiddleware,compose} from 'redux';
import {Provider} from 'react-redux';
import Thunk from 'redux-thunk';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import app from './store/reducers/app';
import auth from './store/reducers/auth';
import info from './store/reducers/info';
import messages from './store/reducers/messages';
import pusher from './store/reducers/pusher';

//Combine multiple reducers for Redux into a main one which will the be passed to the store
const mainReducer = combineReducers({
  auth:auth,
  app:app,
  info:info,
  messages:messages,
  pusher:pusher
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Create the redux store with the main reducer and apply Thunk middleware for async actions
const store = createStore(mainReducer,composeEnhancers(applyMiddleware(Thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
