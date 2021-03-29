import * as actionTypes from '../actions/actionTypes';

const initialState = {
  convosContacts: null,
  convosGroups: null,
  loading:false,
  loading_additional:false,
}

const reducer = (state=initialState,action) => {
  switch(action.type){
    case actionTypes.CREATE_CONVO_CONTACT:
      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`]:{
            messages: action.lastMsg ? {
              [`info_message_${action.lastMsg.id}`]: action.lastMsg
            } : null,
            info:{
              got_messages:false
            }
          }
        }
      }
    case actionTypes.CREATE_CONVO_GROUP:
      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            messages: action.lastMsg ? {
              [`info_message_${action.lastMsg.id}`]: action.lastMsg
            } : null,
            info:{
              got_messages:false
            }
          }
        }
      }
    case actionTypes.GET_MESSAGES_CONVO_CONTACT:
      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`]:{
            messages:{
              ...state.convosContacts[`convo_with_user_${action.userId}`].messages,
              ...action.messages
            },
            info:{
              got_messages:true,
              ...action.info
            }
          }
        }
      }
    case actionTypes.GET_MESSAGES_CONVO_GROUP:
      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            messages:{
              ...state.convosGroups[`convo_group_${action.groupId}`].messages,
              ...action.messages
            },
            info:{
              got_messages:true,
              ...action.info
            }
          }
        }
      }
    case actionTypes.START_LOAD_GET_MESSAGES_CONVO:
      return {
        ...state,
        loading:true
      }
    case actionTypes.END_LOAD_GET_MESSAGES_CONVO:
      return {
        ...state,
        loading:false
      }
    case actionTypes.START_LOAD_GET_ADDITIONAL_MSGS_CONVO:
      return {
        ...state,
        loading_additional: true
      }
    case actionTypes.END_LOAD_GET_ADDITIONAL_MSGS_CONVO:
      return {
        ...state,
        loading_additional:false
      }
    case actionTypes.REMOVE_CONVO_CONTACT:
     let newConvosContacts = {...state.convosContacts};
     delete newConvosContacts[`convo_with_user_${action.userId}`];
      
      return {
        ...state,
        convosContacts:newConvosContacts
      }
    case actionTypes.REMOVE_CONVO_GROUP:
      let newConvosGroups = {...state.convosGroups};
      delete newConvosGroups[`convo_group_${action.groupId}`];

      return {
        ...state,
        convosGroups:newConvosGroups
      }
    case actionTypes.ADD_TEMP_MESSAGE_CONVO_CONTACT:
      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`]:{
            ...state.convosContacts[`convo_with_user_${action.userId}`],
            messages:{
              ...state.convosContacts[`convo_with_user_${action.userId}`].messages,
              [`info_temp_message_${action.tempMessage.id}`] : action.tempMessage
            }
          }
        }
      }
    case actionTypes.ADD_TEMP_MESSAGE_CONVO_GROUP:
      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            ...state.convosGroups[`convo_group_${action.groupId}`],
            messages:{
              ...state.convosGroups[`convo_group_${action.groupId}`].messages,
              [`info_temp_message_${action.tempMessage.id}`]: action.tempMessage
            }
          }
        }
      }
    case actionTypes.ADD_NEW_MESSAGE_CONVO_CONTACT:
      let newContactMessages = {...state.convosContacts[`convo_with_user_${action.userId}`].messages};

      if(action.message.tempId){
        delete newContactMessages[`info_temp_message_${action.message.tempId}`];
      }
      
      newContactMessages[`info_message_${action.message.id}`] = action.message;

      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`] : {
            ...state.convosContacts[`convo_with_user_${action.userId}`],
            messages: newContactMessages
          }
        }
      }
    case actionTypes.ADD_NEW_MESSAGE_CONVO_GROUP:
      let newGroupMessages = {...state.convosGroups[`convo_group_${action.groupId}`].messages};

      if(action.message.tempId){
        delete newGroupMessages[`info_temp_message_${action.message.tempId}`];
      }
      
      newGroupMessages[`info_message_${action.message.id}`] = action.message;

      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            ...state.convosGroups[`convo_group_${action.groupId}`],
            messages:newGroupMessages
          }
        }
      }
    case actionTypes.REMOVE_MESSAGE_CONVO_CONTACT:
      let messagesContactAfterRemove = {...state.convosContacts[`convo_with_user_${action.userId}`].messages}
      delete messagesContactAfterRemove[`info_message_${action.msgId}`];

      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`]:{
            ...state.convosContacts[`convo_with_user_${action.userId}`],
            messages:messagesContactAfterRemove
          }
        }
      }
    case actionTypes.REMOVE_MESSAGE_CONVO_GROUP:
      let messagesGroupAfterRemove = {...state.convosGroups[`convo_group_${action.groupId}`].messages};
      delete messagesGroupAfterRemove[`info_message_${action.msgId}`];

      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            ...state.convosGroups[`convo_group_${action.groupId}`],
            messages:messagesGroupAfterRemove
          }
        }
      }
    case actionTypes.MARK_MESSAGES_AS_READ:
      let newMessages = {};
      let stateMessages = state.convosContacts[`convo_with_user_${action.userId}`].messages;

      for(let el in stateMessages){
        if(stateMessages[el].status === 'sent'){
          newMessages[el] = {
            ...stateMessages[el],
            status:'read'
          }
        }
      }

      return {
        ...state,
        convosContacts:{
          ...state.convosContacts,
          [`convo_with_user_${action.userId}`]:{
            ...state.convosContacts[`convo_with_user_${action.userId}`],
            messages: {
              ...stateMessages,
              ...newMessages
            }
          }
        }
      }
    case actionTypes.ADD_GROUP_NOTIFICATION:
      return {
        ...state,
        convosGroups:{
          ...state.convosGroups,
          [`convo_group_${action.groupId}`]:{
            ...state.convosGroups[`convo_group_${action.groupId}`],
            messages:{
              ...state.convosGroups[`convo_group_${action.groupId}`].messages,
              [`info_notification_${action.notification.id}`]:action.notification
            }
          }
        }
      }
    case actionTypes.CLEAR_MESSAGES:
      return initialState;
    default:
      return state
  }
}

export default reducer;