import * as actionTypes from '../actions/actionTypes';


const initialState = {
  channels:[],
  totalNumberOfChannels:0,
  nrChannelsGotResp:0
}

const reducer = (state=initialState, action) => {
  switch(action.type){
    case actionTypes.ADD_PUSHER_CHANNEL:
      let newChannelsAdd = [...state.channels,action.name];

      return {
        ...state,
        channels:newChannelsAdd
      }
    case actionTypes.REMOVE_PUSHER_CHANNEL:
      let newChannelsRemove = state.channels.filter(item => item !== action.name);
      
      return {
        ...state,
        channels:newChannelsRemove
      }
    case actionTypes.SET_TOTAL_NUMBER_OF_CHANNELS:
      return {
        ...state,
        totalNumberOfChannels: action.total
      }
    case actionTypes.INCREASE_NR_CHANNELS_GOT_RESP:
      return{
        ...state,
        nrChannelsGotResp: state.nrChannelsGotResp +1
      }
    case actionTypes.CLEAR_PUSHER:
      return initialState;
    default:
      return state
  };
};

export default reducer;