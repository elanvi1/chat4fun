import Pusher from 'pusher-js';
import * as globalVariables from '../../globalVariables';
import * as actionTypes from './actionTypes';
import * as actions from './index';

// Creating the pusher object in order to connect to channels and react to certain events
export const createPusherObject = (token) => {
  return (dispatch,getState) => {
    const options = {
      cluster:'your_pusher_cluster',
      forceTLS: true,
      authEndpoint: `your_backend_auth_endpoint_for_pusher`,
      auth:{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    };
  
    window.myPusher = new Pusher('your_pusher_key',options);

    const mainUserId = getState().auth.userId;
  
    window.myPusher.connection.bind('connected', function() {
      // Connecting to the notifications.to.user.${mainUserId}` channel
      dispatch(connectToPusherChannel(`private-notifications.to.user.${mainUserId}`,true));

      let contacts = getState().info.otherUsers;
      // Creating a total nr of channels variable in order to compare it to the total number of channels to which the app connected(or didn't). When the 2 numbers match the main load animation ends.
      let totalNumberOfChannels = 1;

      for(let el in contacts){
        let friendId = contacts[el].user_id;
        let max = Math.max(mainUserId,friendId);
        let min = Math.min(mainUserId,friendId);

        // For each contact, the app connects to a 'chat.between.user.${min}.and.${max}' channel
        totalNumberOfChannels++;
        dispatch(connectToPusherChannel(`private-chat.between.user.${min}.and.${max}`,true));

        if(contacts[el].status === 'accepted' && (contacts[el].other_status === "accepted" || contacts[el].other_status === "deleted")){
          totalNumberOfChannels++;
          // If the friendships status permits it the app also connects to the 'notifications.from.user.${friendId}' channel.
          dispatch(connectToPusherChannel(`private-notifications.from.user.${friendId}`,true));
        }
      }

      let groups = getState().info.groups;

      for(let el in groups){
        let groupId = groups[el].group_id;
        totalNumberOfChannels += 2;
        // For each group, the app connects to 2 channels: 'notifications.group.${groupId}' and 'chat.group.${groupId}'.
        dispatch(connectToPusherChannel(`private-notifications.group.${groupId}`,true));
        dispatch(connectToPusherChannel(`private-chat.group.${groupId}`,true));
      }

      dispatch(setTotalNumberOfChannels(totalNumberOfChannels));
    })
  
    window.myPusher.connection.bind('failed', function() {
      // For more info check store->actions->auth
      dispatch(actions.showOnline(token));
      dispatch(actions.showErrorMessage('Failed to connect to pusher, realtime communication doesn\'t work',null));
    })
  }
};

// Adding the name of the pusher channel in an array in the redux store. This is done in order to unsubscribe from it when the app closes.
export const addPusherChannel = (name) => {
  return {
    type:actionTypes.ADD_PUSHER_CHANNEL,
    name:name
  };
};

// Removing the name of the pusher channel from an array in the redux store. This is done in order to unsubscribe from it when the app closes.
export const removePusherChannel = (name) => {
  return {
    type:actionTypes.REMOVE_PUSHER_CHANNEL,
    name:name
  };
};

// Sets the total number of channels to which the app tried to connect.
const setTotalNumberOfChannels = (total) => {
  return {
    type:actionTypes.SET_TOTAL_NUMBER_OF_CHANNELS,
    total:total
  };
};

// Increases a number in the redux store by 1. The number represents the channels from which a response was received when trying to connect to them. This number is compared to the total number of channels and when they match the main loading animation ends.
const increaseNrChannelsGotResp = () => {
  return {
    type:actionTypes.INCREASE_NR_CHANNELS_GOT_RESP
  };
};

// Resets the pusher reducer state to its inital form.
const clearPusherState = () => {
  return {
    type:actionTypes.CLEAR_PUSHER
  };
};

// AC used to connect to pusher channel
export const connectToPusherChannel = (name,checkEndLoad) => {
  return (dispatch,getState) => {
    window[name] = window.myPusher.subscribe(name);

    window[name].bind('pusher:subscription_succeeded', function() {
      if(checkEndLoad){
        // Checking to see if the load animation should end by comparing the total number of channels to the numbers of channels from which a response was received when trying to compare to them. 
        // If the numbers don't match then the number of channels from which a response was received increases by 1. 
        let totalNrOfCh = getState().pusher.totalNumberOfChannels;
        let nrChGotResp = getState().pusher.nrChannelsGotResp;

        if(totalNrOfCh){
          if(nrChGotResp + 1 === totalNrOfCh){
            let token = getState().auth.token;

            dispatch(actions.showOnline(token));
          }else{
            dispatch(increaseNrChannelsGotResp());
          }
        }
      }

      dispatch(addPusherChannel(name));
      dispatch(bindEventsToChannel(name));
    });

    window[name].bind('pusher:subscription_error', function(err) {
      // Same logic as with pusher:subscription_succeeded, the channel subscription doesn't have to succeed , a response from the attempt must be received.
      if(checkEndLoad){
        let totalNrOfCh = getState().pusher.totalNumberOfChannels;
        let nrChGotResp = getState().pusher.nrChannelsGotResp;

        if(totalNrOfCh){
          if(nrChGotResp + 1 === totalNrOfCh){
            let token = getState().auth.token;

            dispatch(actions.showOnline(token));
          }else{
            dispatch(increaseNrChannelsGotResp());
          }
        }
      }
      
      dispatch(actions.showErrorMessage(`Failed to connect to pusher channel ${name}`,null));
    });
  };
};

// Disconnecting from a pusher channel and removing its name from the redux store as well as from the window obj.
export const disconnectFromPusherChannel = (name) => {
  return dispatch => {
    window.myPusher.unsubscribe(name);
    dispatch(removePusherChannel(name));
    window[name] = null;
  };
};

// AC used to bind events to a channel depending on the channels name. These events are triggered when certain actions are taken in the backend, allowing us to receive info from the server at the time these actions are taken.
export const bindEventsToChannel=  (chName) => {
  return (dispatch,getState) => {
    let mainUserId = getState().auth.userId;

    if(chName.includes('notifications.to.user')){
      // Event triggered when a user accepts or reject a friendship request from the main user
      window[chName].bind('FriendshipAcceptedOrRejected',function(data){
        if(data.notification.title.includes('Accepted')){
          let friendId = data.info.user_id;
          let max = Math.max(mainUserId,friendId);
          let min = Math.min(mainUserId,friendId);

          dispatch(actions.addUserInfo(data.info));
          dispatch(actions.createConvoContact(friendId,data.info.last_message));
          
          dispatch(connectToPusherChannel(`private-chat.between.user.${min}.and.${max}`));
          dispatch(connectToPusherChannel(`private-notifications.from.user.${friendId}`));
        }

        dispatch(actions.addNotification(data.notification));
      });

      // Event triggered when a contact changes the friendship status with the main user.
      window[chName].bind('FriendshipStatusUpdated',function(data){
        let title = data.notification.title;
        let friendId = data.friend_id;
        let status = '';
        let otherStatus = '';
        
        if(!title.includes('Request')){
          status = getState().info.otherUsers[`info_user_${friendId}`].status;
          otherStatus = getState().info.otherUsers[`info_user_${friendId}`].other_status;
        }

        if(title.includes(' unblocked ') || title.includes('readded')){
          dispatch(actions.changeFriendshipOtherStatus(friendId,'accepted'));

          if(status === 'accepted'){
            dispatch(connectToPusherChannel(`private-notifications.from.user.${friendId}`));
            dispatch(actions.showContactOnline(friendId));
            if(data.is_active){
              dispatch(actions.showContactActive(friendId));
            }
          }
        }else if(title.includes(' blocked ')){
          if(status === 'accepted' ){
            dispatch(disconnectFromPusherChannel(`private-notifications.from.user.${friendId}`));
            dispatch(actions.showContactOffline(friendId));
            dispatch(actions.showContactInactive(friendId));
          }

          dispatch(actions.changeFriendshipOtherStatus(friendId,'blocked'));
        }else if(title.includes('removed')){
          if(status === 'accepted' && otherStatus === 'accepted'){
            dispatch(actions.showContactOffline(friendId));
            dispatch(actions.showContactInactive(friendId));
            dispatch(disconnectFromPusherChannel(`private-notifications.from.user.${friendId}`));
          }

          dispatch(actions.changeFriendshipOtherStatus(friendId,'removed'));
        }

        dispatch(actions.addNotification(data.notification));
      });

      // Event triggered when a group is deleted by another member
      window[chName].bind('GroupDeleted',function(data){
        dispatch(removeGroupAndChannels(data));
      });

      // Event triggered when main users permission in group is changed by a member
      window[chName].bind('UserPermissionChanged',function(data){
        dispatch(actions.updatePermissionMainUser(data.info.group_id,data.info.permission));
        dispatch(actions.addNotification(data.notification));
      });

      // Event triggered when the main user was added to a group by a contact
      window[chName].bind('UserWasAddedToGroupIndividual',function(data){
        let groupId = data.info.group_id;
        dispatch(connectToPusherChannel(`private-notifications.group.${groupId}`));
        dispatch(connectToPusherChannel(`private-chat.group.${groupId}`));

        dispatch(actions.addGroup(data.info));
        dispatch(actions.createConvoGroup(groupId,data.info.last_message));
        dispatch(actions.addNotification(data.notification));
      });

      // Event triggered when the main user was removed from the group by a member
      window[chName].bind('UserWasRemovedFromGroupIndividual',function(data){
        dispatch(removeGroupAndChannels(data));
      });

      // Event triggered when receiving a message in group or contact convo. In the case of contact convos it is also triggered when an unread message is deleted.
      window[chName].bind('UpdateUnreadMessagesContact',function(data){
        dispatch(actions.updateUnreadMessagesContact(data.friend_id,data.unread_messages));
      });
    }else if(chName.includes('notifications.from.user')){
      // Event triggered a contact info changed(username, image etc.)
      window[chName].bind('UserInfoChanged',function(data){
        dispatch(actions.changeContactInfo(data.info));

        if(data.notification){
          dispatch(actions.addNotification(data.notification));
        }
      });

      // Event triggered when a contact is online
      window[chName].bind('UserOnline',function(data){
        dispatch(actions.showContactOnline(data.id));
      });

      // Event triggered when a contact is offline
      window[chName].bind('UserOffline',function(data){
        dispatch(actions.showContactOffline(data.id));
        dispatch(actions.showContactInactive(data.id));
      });
    }else if(chName.includes('chat.between.user')){
      // Event triggered when a contact is active on the chat
      window[chName].bind('UserActive',function(data){
        dispatch(actions.showContactActive(data.friend_id));
      });

      // Event triggered when a contact is inactive on the chat
      window[chName].bind('UserInactive',function(data){
        dispatch(actions.showContactInactive(data.friend_id));
      })

      // Event triggered when a message is received from a contact
      window[chName].bind('UserMessageReceived',function(data){
        dispatch(actions.addNewMessageConvoContact(data.message.sender_id,data.message));
        dispatch(actions.replaceLastMessageContact(data.message.sender_id,data.message));
      });

      // Event triggered when a contact reads the messages sent by the main user
      window[chName].bind('MarkMessagesAsRead',function(data){
        dispatch(actions.markMessagesAsRead(data.auth_user_id));
        dispatch(actions.markLastMessageAsRead(data.auth_user_id));
      });

      // Event triggered when a message was deleted by a contact
      window[chName].bind('UserMessageDeleted',function(data){
        let friendId = data.friend_id;
        let msgId = data.message_id;
        let messages = getState().messages.convosContacts[`convo_with_user_${friendId}`].messages;

        dispatch(actions.removeMessageConvoContact(friendId,msgId));

        if(getLatestMsgId(messages) === msgId){
          // In the eventuality the deleted message is the last message, the last message is replaced with the next message.
          dispatch(actions.replaceLastMessageContact(friendId,getSecondToLastMsg(messages)));
        }
      });
    }else if(chName.includes('notifications.group')){
      // Event triggered when someone changes the group info(name, image etc.)
      window[chName].bind('GroupInfoUpdated',function(data){
        dispatch(actions.makeChangeToGroupInfo(data.info.group_id,data.info))
      });

      // Event triggered when a user was added to a group
      window[chName].bind('UserAddedToGroup',function(data){
        dispatch(actions.userWasAddedToGroup(data.group_id,data.info));
        dispatch(actions.addGroupNotification(data.group_id,data.notification));
      });

      // Event triggered when a groups member info change. This includes username, image as well as the permission for that group.
      window[chName].bind('UserGroupInfoChanged',function(data){
        let newInfo = {...data.info,id:data.info.user_id};
        delete newInfo.user_id;

        dispatch(actions.updateGroupMemberInfo(data.group_id,newInfo));

        if(data.notification){
          dispatch(actions.addGroupNotification(data.group_id,data.notification));
        }
      });

      // Event triggered when a user was removed or left a group.
      window[chName].bind('UserRemovedFromGroup',function(data){
        dispatch(actions.makeRemovalOfGroupMember(data.info.group_id,data.info.user_id));
        dispatch(actions.addGroupNotification(data.info.group_id,data.notification));
      });
    }else if(chName.includes('chat.group')){
      // Event triggered when a message is received in group chat.
      window[chName].bind('GroupMessageReceived',function(data){
        let groupId = data.message.receiver_id;
        let senderId = data.message.sender_id;
        let senderAlias = getState().info.groups[`info_group_${groupId}`].members[`info_user_${senderId}`].alias;
        let senderUsername = getState().info.groups[`info_group_${groupId}`].members[`info_user_${senderId}`].username;
        let name = senderAlias ? senderAlias : senderUsername;
        let newMessage = {
          ...data.message,
          sender_name:name
        };
        let activeGroupId = getState().info.activeGroupId;

        dispatch(actions.addNewMessageConvoGroup(groupId,newMessage));
        dispatch(actions.replaceLastMessageGroup(groupId,newMessage));

        // Because the backend doesn't keep track if a user is active on a group or not, it has to be done in the front end. Only the number of unread messages in a group is kept in the backend and it increases for each member with each message sent(except for the member that sent it). If the main user is active on that chat then a request is made to the server to reset the nr of unread msgs for that user and group combination. If the user is not active then the number of unread messages is also increased in the front end.
        if(activeGroupId === groupId){
          dispatch(actions.resetUnreadMessagesGroup(getState().auth.token,groupId));
        }else{
          dispatch(actions.increaseUnreadMessagesGroup(groupId));
        }
      });

      // Event triggered when a group message is deleted by another member.
      window[chName].bind('GroupMessageDeleted',function(data){
        let groupId = data.message.receiver_id;
        let msgId = data.message.id;
        let messages = getState().messages.convosGroups[`convo_group_${groupId}`].messages;

        dispatch(actions.removeMessageConvoGroup(groupId,msgId));

        if(getLatestMsgId(messages) === msgId){
          dispatch(actions.replaceLastMessageGroup(groupId,getSecondToLastMsg(messages)));
        }
      });
    }
  };
};

// Helper function used to remove a group from the front end
const removeGroupAndChannels = (data) => {
  return dispatch => {
    let groupId = data.group_id;

    dispatch(disconnectFromPusherChannel(`private-notifications.group.${groupId}`));
    dispatch(disconnectFromPusherChannel(`private-chat.group.${groupId}`));
    
    dispatch(actions.changeGroupIsDeletedAttr(groupId));
    dispatch(actions.addNotification(data.notification));
  };
};

// Helper function used to retrieve the id of the last msg in a convo
export const getLatestMsgId = (messages) => {
  let myId = 0;

  for(let el in messages){
    if(el.includes('message')){
      if(!myId){
        myId = messages[el].id;
      }else{
        if(messages[el].id > myId){
          myId = messages[el].id;
        }
      }
    }
  }

  return myId;
}

// Helper function used to retreive the second to last msg in a convo
const getSecondToLastMsg = (messages) => {
  let msgsArray = [];

  for(let el in messages){
    if(el.includes('message')){
      msgsArray.push(messages[el]);
    }
  }

  if(msgsArray.length < 2){
    return null;
  }else{
    msgsArray = msgsArray.sort((el1,el2) => {
      return el2.id - el1.id
    })

    return msgsArray[1];
  }
}

// Disconnecting from every pusher channel as well as clearing the window obj and reseting the pusher store state to its initial value.
export const clearPusher = () => {
  return (dispatch,getState) => {
    let channels = getState().pusher.channels;

    channels.forEach(channel => {
      dispatch(disconnectFromPusherChannel(channel));
    });

    window.myPusher.disconnect();
    window.myPusher = null;

    dispatch(clearPusherState());
  };
};