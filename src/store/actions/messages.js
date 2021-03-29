import * as actionTypes from './actionTypes';
import * as actions from './index';
import axios from '../../axios-instance';

// Creating the conversation in redux store for a contact chat. The conversation contains the messages and info. Info has helpful data like: were the messages retrieved from the server, are there any more messages to retriever, total nr. of messages for that convo etc. 
export const createConvoContact = (userId,lastMsg) => {
  return {
    type:actionTypes.CREATE_CONVO_CONTACT,
    userId:userId,
    lastMsg:lastMsg
  };
};

// Creating the conversation in redux store for a contact chat. Same structure as a contact convo.
export const createConvoGroup = (groupId,lastMsg) => {
  return {
    type:actionTypes.CREATE_CONVO_GROUP,
    groupId:groupId,
    lastMsg:lastMsg
  };
};

// Adding a maximum of 30 messages to the contact chat along with additional info about the messages
export const addMessagesConvoContact = (userId,messages,info) => {
  return {
    type:actionTypes.GET_MESSAGES_CONVO_CONTACT,
    userId:userId,
    messages:messages,
    info:info
  };
};

// Adding a maximum of 30 messages to the group chat along with additional info about the messages
const addMessagesConvoGroup = (groupId,messages,info) => {
  return {
    type:actionTypes.GET_MESSAGES_CONVO_GROUP,
    groupId:groupId,
    messages:messages,
    info:info
  };
};

// Adds a spinner to the MessagesMain comp, above the last message(if it exists) while waiting to retrieve the messages from the server.
const startLoadGetMessagesConvo = () => {
  return {
    type:actionTypes.START_LOAD_GET_MESSAGES_CONVO,
  };
};

// Removes the spinner from MessagesMain comp, and replaces it with the messages retrieved from the server.
const endLoadGetMessagesConvo = () => {
  return {
    type:actionTypes.END_LOAD_GET_MESSAGES_CONVO,
  };
};

// Adds a spinner at the top of the chat, when the user scrolls to the top. It stays there while waiting to retrieve additional messages for that convo
const startLoadGetAdditionalMsgsConvo = () => {
  return {
    type:actionTypes.START_LOAD_GET_ADDITIONAL_MSGS_CONVO
  };
};

// Removes the spinner from the top of the chat and replaces it with the new messages retrieved from the server.
const endLoadGetAdditionalMsgsConvo = () => {
  return {
    type:actionTypes.END_LOAD_GET_ADDITIONAL_MSGS_CONVO
  };
};

// Removes a conversation with a contact from the redux store, usually happens when a contact is removed.
export const removeConvoContact = (userId) => {
  return {
    type:actionTypes.REMOVE_CONVO_CONTACT,
    userId:userId
  };
};

// Removes a group conversation from the redux store, usually happens when a group is removed or deleted.
export const removeConvoGroup = (groupId) => {
  return {
    type:actionTypes.REMOVE_CONVO_GROUP,
    groupId:groupId
  };
};

// When the main user sends a message, a temporary message is created and added to the chat while the actual message is being processed in the backend. This temp message has a 'sending' status which shows a spinner in the bottom right corner. When the backend finishes processing, the temp message is replaced by the actual message.
const addTempMessageConvoContact = (userId,tempMessage) => {
  return {
    type:actionTypes.ADD_TEMP_MESSAGE_CONVO_CONTACT,
    userId:userId,
    tempMessage:tempMessage
  };
};

// Same logic as addTempMessageConvoContact
const addTempMessageConvoGroup = (groupId,tempMessage) => {
  return {
    type:actionTypes.ADD_TEMP_MESSAGE_CONVO_GROUP,
    groupId:groupId,
    tempMessage:tempMessage
  };
};

// Adding the actual message to the redux store after it was processed by the back end. It replaces the temporary message
export const addNewMessageConvoContact = (userId,message) => {
  return {
    type:actionTypes.ADD_NEW_MESSAGE_CONVO_CONTACT,
    userId:userId,
    message:message
  };
};

// Same logic as addNewMessageConvoContact
export const addNewMessageConvoGroup = (groupId,message) => {
  return {
    type:actionTypes.ADD_NEW_MESSAGE_CONVO_GROUP,
    groupId:groupId,
    message:message
  }
}

// Removes a message from a contact convo in redux store.
export const removeMessageConvoContact = (userId,msgId) => {
  return {
    type:actionTypes.REMOVE_MESSAGE_CONVO_CONTACT,
    userId:userId,
    msgId:msgId
  };
};

// Removes a message from a group convo in redux store.
export const removeMessageConvoGroup = (groupId,msgId) => {
  return {
    type:actionTypes.REMOVE_MESSAGE_CONVO_GROUP,
    groupId:groupId,
    msgId:msgId
  };
};

// Changes the status from 'sent' to 'read' for all messages that have 'sent' status, in the redux store, for a contact convo.
export const markMessagesAsRead = (userId) => {
  return {
    type:actionTypes.MARK_MESSAGES_AS_READ,
    userId:userId
  };
};

// Adds a group notification to the messages part of a convo, in the redux store. A notification shows info about the group(someone joined, left etc.) and is displayed similarly to a message.
export const addGroupNotification = (groupId,notification) => {
  return {
    type:actionTypes.ADD_GROUP_NOTIFICATION,
    groupId:groupId,
    notification:notification
  };
};

// AC used to retrieve messages from the server, the initial ones as well as the additianl ones. 
export const getMessagesConvo = (id,type,token,page,forAdditional) => {
  return dispatch => {
    // Adding a different spinner for initial and additional messages
    if(forAdditional){
      dispatch(startLoadGetAdditionalMsgsConvo());
    }else{
      dispatch(startLoadGetMessagesConvo());
    }

    // There is a different endpoint for retrieving messages for a group convo and a contact convo.
    let url = type === 'contact' ? `/conversation_with_user/${id}` : type === 'group' ? `group/${id}/messages` : 'noUrl';
    url += `?page=${page}`

    axios({
      method:'get',
      url:url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      if(type === 'contact'){
        dispatch(addMessagesConvoContact(id,res.data.data,res.data.info));
      }else if(type === 'group'){
        dispatch(addMessagesConvoGroup(id,res.data.data,res.data.info));
      }
      
      if(forAdditional){
        dispatch(endLoadGetAdditionalMsgsConvo());
      }else{
        dispatch(endLoadGetMessagesConvo());
      }
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      if(forAdditional){
        dispatch(endLoadGetAdditionalMsgsConvo());
      }else{
        dispatch(endLoadGetMessagesConvo());
      }
    })
  };
};

// Makes a post request at '/message' endpoint in order to store a message. The payload contains the necessary properties, for creating a message, as an object literal.
export const sendMessage = (type,id,tempMessage,token) => {
  return dispatch => {
    // Adding the temporary message before making the request
    if(type === 'contact'){
      dispatch(addTempMessageConvoContact(id,tempMessage));
      dispatch(actions.replaceLastMessageContact(id,tempMessage));
    }else{
      dispatch(addTempMessageConvoGroup(id,tempMessage));
      dispatch(actions.replaceLastMessageGroup(id,tempMessage));
    }

    axios({
      method:'post',
      url:'/message',
      data:tempMessage,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res => {
      let newMessage = {...res.data.data,tempId:tempMessage.id}

      if(type === 'contact'){
        dispatch(addNewMessageConvoContact(id,newMessage));
        // For more info check out store->actions->info
        dispatch(actions.replaceLastMessageContact(id,newMessage));
      }else{
        dispatch(addNewMessageConvoGroup(id,newMessage));
        // For more info check out store->actions->info
        dispatch(actions.replaceLastMessageGroup(id,newMessage));
      }
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;
      tempMessage.status = 'failed';

      if(type === 'contact'){
        dispatch(addTempMessageConvoContact(id,tempMessage));
        dispatch(actions.replaceLastMessageContact(id,tempMessage));
      }else{
        dispatch(addTempMessageConvoGroup(id,tempMessage));
        dispatch(actions.replaceLastMessageGroup(id,tempMessage));
      }

      dispatch(actions.showErrorMessage(error,null));
    })
  };
};

// Makes a delete request at `/message/${msgId}` in order to delete a message. The message is deleted for everybody not just the main user.
export const deleteMessage = (token,id,type,msgId,isLastMsg,nextMsg) => {
  return dispatch => {
    // Removing the message prior to making the request
    if(type === 'contact'){
      dispatch(removeMessageConvoContact(id,msgId));
      // Checking to see if the deleted message is the last message and if so replacing it in the info reducer
      if(isLastMsg){
        // For more info check out store->actions->info
        dispatch(actions.replaceLastMessageContact(id,nextMsg));
      }
    }else{
      dispatch(removeMessageConvoGroup(id,msgId));
      // Checking to see if the deleted message is the last message and if so replacing it in the info reducer
      if(isLastMsg){
        // For more info check out store->actions->info
        dispatch(actions.replaceLastMessageGroup(id,nextMsg));
      }
    }

    axios({
      method:'delete',
      url:`/message/${msgId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res => {}).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
    })
  };
};

// Resets the info in the messages reducer, thus having the initial store info.
export const clearMessages = () => {
  return {
    type:actionTypes.CLEAR_MESSAGES
  };
};
