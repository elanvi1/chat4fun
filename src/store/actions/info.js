import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';
import * as actions from './index';

// Add the info about the main user to the redux store
const addMainUserInfo = (mainUserInfo) => {
  return {
    type:actionTypes.ADD_MAIN_USER_INFO,
    mainUserInfo: mainUserInfo
  };
};

// Add the info about the mains users contacts to the redux store
const addOtherUsersInfo = (otherUsersInfo) => {
  let newOtherUsersInfo = {};

  // Adding a loading prop that is used to add a spinner instead of the contact info while performing an action on that contact(happens in IndividualMiniInfo comp)
  if(otherUsersInfo){
    for(let el in otherUsersInfo){
      newOtherUsersInfo[el] = {
        ...otherUsersInfo[el],
        loading:false
      }
    }
  }

  return {
    type:actionTypes.ADD_OTHER_USERS_INFO,
    otherUsersInfo: newOtherUsersInfo
    };
};

// Add the info about the main users groups to the redux store
const addGroupsInfo = (groupsInfo) => {
  let newGroupsInfo = {};

  // Adding a loading prop that is used to add a spinner instead of the group info while performing an action on that group(happens in IndividualMiniInfo comp)
  // Adding a isDeleted prop in order to remove the group, this was added for pusher notifications. More specifically when another member of the group deletes the group. Since React component state wasn't easily accessible to make certain chaneges this attribute was created. In the Main comps componentDidUpdate method a check if performed to see if a groups isDeleted prop is true in order to remove it and make the necessary state changes.
  if(groupsInfo){
    for(let el in groupsInfo){
      newGroupsInfo[el] = {
        ...groupsInfo[el],
        loading:false,
        isDeleted:false
      }
    }
  }

  return {
    type:actionTypes.ADD_GROUPS_INFO,
    groupsInfo: newGroupsInfo
  };
};

// Adds the info about main users notifications to the redux store
const addNotificationsInfo = (notificationsInfo) => {
  let newNotificationInfo = {};

  // Adding a loading prop that is used to add a spinner instead of the notification info while performing an action on that notification(happens in IndividualMiniInfo comp)
  // Adding the prop minimized to toggle between the minimized and expanded version
  if(notificationsInfo){
    for(let el in notificationsInfo){
      newNotificationInfo[el] = {
        ...notificationsInfo[el],
        minimized: true,
        loading:false
      }
    }
  }

  return {
    type:actionTypes.ADD_NOTIFICATIONS_INFO,
    notificationsInfo:newNotificationInfo
  };
};

// Adds an array with the user ids of the users that have a pending friendship with the main user, to the redux store. It is used in the MessagesIfnoGroup comp so that the main user can't send a friendship request to member of the group if there is already one.
export const addUserIdsPendingFriendships = (ids) => {
  return {
    type: actionTypes.ADD_USER_IDS_PENDING_FRIENDSHIPS,
    ids:ids
  };
};

// Adds a single id to the array of user ids of the users that have a pending friendship with the main user
export const addUserIdPendingFriendship = (id) => {
  return {
    type:actionTypes.ADD_USER_ID_PENDING_FRIENDSHIP,
    id:id
  };
};

// Remove a single id to the array of user ids of the users that have a pending friendship with the main user
export const removeUserIdPendingFriendship = (id) => {
  return {
    type:actionTypes.REMOVE_USER_ID_PENDING_FRIENDSHIP,
    id:id
  };
};

// Make a change to the status of a notification(read or unread)
const makeChangeToNotificationStatus = (id,status) => {
  return {
    type:actionTypes.CHANGE_NOTIFICATION_STATUS,
    id:id,
    status:status
  };
};

// Extends or minifies a notification
export const changeNotificationExtension = (id) => {
  return {
    type:actionTypes.CHANGE_NOTIFICATION_EXTENSION,
    id:id
  }
}

// Add a spinner as the contents of the IndividualMiniInfo comp for a certain contact when taking an async action related to that contact(block, unblock or remove)
const startIndividualLoad = (id,activeType) => {
  return {
    type:actionTypes.START_INDIVIDUAL_LOAD,
    id:id,
    activeType:activeType
  };
};

// Replaces the spinner with the info of the contact in IndividualMiniInfo comp. This happens when a response is received from the backend regarding the action that was taken.
const endIndividualLoad = (id,activeType) => {
  return {
    type:actionTypes.END_INDIVIDUAL_LOAD,
    id:id,
    activeType:activeType
  };
};

// Adds a notification for the main user, to the redux store
export const addNotification = (notification) => {
  return {
    type:actionTypes.ADD_NOTIFICATION,
    notification:notification
  };
};

// Removes a notification from the redux store
const removeNotification = (id) => {
  return {
    type:actionTypes.REMOVE_NOTIFICATION,
    id:id
  }
}

// Adds the information about a user to the redux store, thus making that user a contact.
export const addUserInfo = (userInfo) => {
  let newUserInfo = {...userInfo,loading:false};

  return {  
    type:actionTypes.ADD_USER_INFO,
    userInfo:newUserInfo
    }
};

// Removes a user from the contact list
const removeUserInfo = (id) => {
  return {
    type:actionTypes.REMOVE_USER_INFO,
    id:id
  }
}

// Makes a change to the friendship status of a contact in the redux store. 
const makeChangeToFriendshipStatus = (id,status) => {
  return {
    type:actionTypes.CHANGE_FRIENDSHIP_STATUS,
    id:id,
    status:status
  };
};

// Makes a change to the friendship of the contact with the main user in the redux store. This Action creator is dispatched only when the contact takes the action, the main user can't take any actions to trigger this AC. 
export const changeFriendshipOtherStatus = (id,status) => {
  return {
    type:actionTypes.CHANGE_FRIENDSHIP_OTHER_STATUS,
    id:id,
    status:status
  };
};

// Adds a group to the redux store
export const addGroup = (groupInfo) => {
  let newGroupInfo = {
    ...groupInfo,
    loading:false,
    isDeleted:false
  }

  return {
    type:actionTypes.ADD_GROUP,
    groupInfo:newGroupInfo
  };
};

// Adds a spinner to the CreateGroup comp while waiting to receive a response from the request to the backend to create a group. 
const startLoadGroupCreate = () => {
  return {
    type:actionTypes.START_LOAD_GROUP_CREATE
  };
};

// Removes the spinner from the CreateGroup comp when a response is received from the backed for the request to create a group.
const endLoadGroupCreate = () => {
  return {
    type:actionTypes.END_LOAD_GROUP_CREATE
  };
};

// Removes a group from the redux store
const removeGroup = (id) => {
  return {
    type:actionTypes.REMOVE_GROUP,
    id:id
  };
};

// Changes the isDeleted prop of a group so that the group can be deleted
export const changeGroupIsDeletedAttr = (groupId) => {
  return {
    type:actionTypes.CHANGE_IS_DELETED_GROUP_ATTR,
    groupId:groupId
  };
};

// Makes a change in the redux store regarding the main users info.
const makeChangeToMainUserInfo = (attribute,value) => {
  return {
    type:actionTypes.CHANGE_MAIN_USER_INFO,
    attribute:attribute,
    value:value
  };
};

// Makes a change in the redux store regarding a contact info.
export const changeContactInfo = (info) => {
  return {
    type:actionTypes.CHANGE_CONTACT_INFO,
    info:info
  };
};

// Adds a spinner instead of the info about a certain attribute of main user info, while waiting for the change of said attribute to take place in the backend. This happens in the InfoUser comp
const startLoadMainUserInfo = (attribute) => {
  return {
    type:actionTypes.START_LOAD_MAIN_USER_INFO,
    attribute:attribute
  };
};

// Removes the spinner and shows the attribute new info in InfoUser comp. This happens when a response was received from the server regarding the change of the attribute.
const endLoadMainUserInfo = (attribute) => {
  return {
    type:actionTypes.END_LOAD_MAIN_USER_INFO,
    attribute:attribute
  }
}

// Adds a spinner to the AddContact comp while waiting to receive a response from the backend regarding the request of retrieving the info about the users that fit the search criteria. 
const startLoadContactsForAdd = () => {
  return {
    type:actionTypes.START_LOAD_CONTACTS_FOR_ADD
  };
};

// Removes the spinner from the AddContact comp when a response is received from the backend.
const addContactsForAdd = (list,message) => {
  return {
    type:actionTypes.ADD_CONTACTS_FOR_ADD,
    list:list,
    message:message
  };
};

// Removes the info regarding users that could be potientally added as contacts from the redux store.
export const clearContactsForAdd = () => {
  return {
    type:actionTypes.CLEAR_CONTACTS_FOR_ADD
  };
};

// Resets the number of unread messages from a contact in the redux store
const makeResetUnreadMessagesContact = (userId) => {
  return {
    type:actionTypes.RESET_UNREAD_MESSAGES_CONTACT,
    userId:userId
  };
};

// Resets the number of unread messages in a group in the redux store
const makeResetUnreadMessagesGroup = (groupId) => {
  return {
    type:actionTypes.RESET_UNREAD_MESSAGES_GROUP,
    groupId:groupId
  };
};

// Replaces the last message received from a contact. The last message of a chat with a contact is retrieved prior to the other messages, along with the contacts info and it's shown in the IndividualMiniInfo comp and in MessagesMain comp even before retrieving the other messages.
export const replaceLastMessageContact = (userId,lastMessage) => {
  return {
    type:actionTypes.REPLACE_LAST_MESSAGE_CONTACT,
    userId:userId,
    lastMessage:lastMessage
  };
};

// Replaces the last message received in a group. The last message of a group chat is retrieved prior to the other messages, along with the groups info and it's shown in the IndividualMiniInfo comp and in MessagesMain comp even before retrieving the other messages.
export const replaceLastMessageGroup = (groupId,lastMessage) => {
  return {
    type:actionTypes.REPLACE_LAST_MESSAGE_GROUP,
    groupId:groupId,
    lastMessage:lastMessage
  };
};

// Adds a spinner to the MessagesInfoContact comp,instead of the info regarding the alias, while waiting to receive a response from the backend regarding the request of changing the alias of that contact. 
const startLoadChangeAlias = () => {
  return {
    type:actionTypes.START_LOAD_CHANGE_ALIAS
  };
};

// Removes the spinner from the MessagesInfoContact comp when a response is received from the backend and shows the new alias
const endLoadChangeAlias = () => {
  return {
    type:actionTypes.END_LOAD_CHANGE_ALIAS
  };
};

// Changes the alias of a contact in the redux store
const makeChangeToAlias = (userId,alias) => {
  return {
    type:actionTypes.CHANGE_ALIAS,
    userId:userId,
    alias:alias
  };
};

// Adds a spinner to the MessagesInfoGroup comp,instead of the info regarding an attribute, while waiting to receive a response from the backend regarding the request of changing the attribute of that group. 
const startLoadChangeGroupInfo = (attribute) => {
  return {
    type:actionTypes.START_LOAD_CHANGE_GROUP_INFO,
    attribute:attribute
  };
};

// Removes the spinner from the MessagesInfoGroup comp when a response is received from the backend and shows the new attribute
const endLoadChangeGroupInfo = (attribute) => {
  return {
    type:actionTypes.END_LOAD_CHANGE_GROUP_INFO,
    attribute:attribute
  };
};

// Changes an attribute of the group info(name, image etc.) in the redux store.
export const makeChangeToGroupInfo = (groupId,attrObj) => {
  return {
    type:actionTypes.CHANGE_GROUP_INFO,
    groupId:groupId,
    attrObj:attrObj
  };
};

// Adds a spinner to the ModalAddContact comp,instead of the contacts that can be added to the group, while waiting to receive a response from the backend regarding the request of adding a contact to that group. 
const startLoadAddContactToGroup = () => {
  return {
    type:actionTypes.START_LOAD_ADD_CONTACT_TO_GROUP
  };
};

// Removes the spinner from the ModalAddContact comp when a response is received from the backend and shows the contacts that can be added to the group
const endLoadAddContactToGroup = () => {
  return {
    type:actionTypes.END_LOAD_ADD_CONTACT_TO_GROUP
  };
};

// Adding a new member to the group in the redux store
export const userWasAddedToGroup = (groupId,userInfo) => {
  return {
    type:actionTypes.USER_WAS_ADDED_TO_GROUP,
    groupId:groupId,
    userInfo:userInfo
  };
};

// Adds a spinner to the ModalMembers comp,instead of the group members, while waiting to receive a response from the backend regarding the request of taking an action regarding a member(add to contact list, remove from group etc.) 
const startLoadMembersAction = () => {
  return {
    type:actionTypes.START_LOAD_MEMBERS_ACTION
  };
};

// Removes the spinner from the ModalMembers comp when a response is received from the backend and shows the members of the group.
const endLoadMembersAction = () => {
  return {
    type:actionTypes.END_LOAD_MEMBERS_ACTION
  };
};

// Removes a member of the group from the redux store
export const makeRemovalOfGroupMember = (groupId,userId) => {
  return {
    type:actionTypes.REMOVE_GROUP_MEMBER,
    groupId:groupId,
    userId:userId
  };
};

// Update the info of a group member in hte redux store
export const updateGroupMemberInfo = (groupId,info) => {
  return {
    type:actionTypes.UPDATE_GROUP_MEMBER_INFO,
    groupId:groupId,
    info:info
  };
};

// Updates the permission of a group member in the redux store
export const updatePermissionMainUser = (groupId,permission) => {
  return {
    type:actionTypes.UPDATE_PERMISSION_MAIN_USER,
    groupId:groupId,
    permission:permission
  };
};

// Changes the is_online prop of a contact to true in the redux store
export const showContactOnline = (id) => {
  return {
    type:actionTypes.SHOW_CONTACT_ONLINE,
    id:id
  };
};

// Changes the is_online prop of a contact to false in the redux store
export const showContactOffline = (id) => {
  return {
    type:actionTypes.SHOW_CONTACT_OFFLINE,
    id:id
  };
};

// Changes the is_active prop of a contact to true in the redux store
export const showContactActive = (id) => {
  return {
    type:actionTypes.SHOW_CONTACT_ACTIVE,
    id:id
  };
};

// Changes the is_active prop of a contact to false in the redux store
export const showContactInactive = (id) => {
  return {
    type:actionTypes.SHOW_CONTACT_INACTIVE,
    id:id
  };
};

// Updates the number of unread messages received from a contact, in the redux store.
export const updateUnreadMessagesContact = (id,unreadMessages) => {
  return {
    type:actionTypes.UPDATE_UNREAD_MESSAGES_CONTACT,
    id:id,
    unreadMessages:unreadMessages
  };
};

// Increases the number of unread messages in a group , in the redux store.
export const increaseUnreadMessagesGroup = (groupId) => {
  return {
    type:actionTypes.INCREASE_UNREAD_MESSAGES_GROUP,
    groupId:groupId
  };
};

// Changes the status of the last message, received from a contact, to read in the redux store.
export const markLastMessageAsRead = (userId) => {
  return {
    type:actionTypes.MARK_LAST_MESSAGE_AS_READ,
    userId:userId
  };
};

// Changes the activeGroupId property in the redux store to the id of the active group. Check Main comp for more info.
export const makeGroupActive = (groupId) => {
  return {
    type:actionTypes.MAKE_GROUP_ACTIVE,
    groupId:groupId
  };
};

// Changes the activeGroupId property in the redux store to 0. Check Main comp for more info.
export const makeGroupInactive = () => {
  return {
    type:actionTypes.MAKE_GROUP_INACTIVE
  };
};

// Makes at request at `/user/${userId}` endpoint in order to retrieve the information about the user
export const getMainUserInfo = (userId,token) => {
  return dispatch => {
    axios({
      method:'get',
      url:`/user/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      dispatch(addMainUserInfo(res.data.data));
      dispatch(getOtherUsersInfo(token,userId));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(actions.endLoad());
    })
  }
}

// Makes a request at '/friendship' endpoint in order to retrieve the information about the contacts. 
export const getOtherUsersInfo = (token,mainUserId) => {
  return dispatch => {
    axios({
      method:'get',
      url:'/friendship',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      // Check store->actions->messages for more info
      for(let el in res.data.data){
        dispatch(actions.createConvoContact(res.data.data[el].user_id,res.data.data[el].last_message));
      }
      dispatch(addOtherUsersInfo(res.data.data));
      dispatch(getGroupsInfo(token));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(actions.endLoad());
    })
  };
};

// Makes a request at '/group' endpoint in order to retrieve the information about the groups
export const getGroupsInfo = (token) => {
  return dispatch => {
    axios({
      method:'get',
      url:'/group',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      // Check store->actions->messages for more info
      for(let el in res.data.data){
        dispatch(actions.createConvoGroup(res.data.data[el].group_id,res.data.data[el].last_message));
      }
      dispatch(addGroupsInfo(res.data.data));
      dispatch(getNotificationsInfo(token));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(actions.endLoad());
    })
  }
}

// Makes a request at '/notification' endpoint in order to retrieve the information about the notifications
export const getNotificationsInfo = (token) => {
  return dispatch => {
    axios({
      method:'get',
      url:'/notification',
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res  => {
      dispatch(addNotificationsInfo(res.data.data));
      dispatch(getUserIdsPendingFriendships(token));
    }).catch(err => {
      let errMsg = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(errMsg,null));
      dispatch(actions.endLoad());
    })
  }
}

// Makes a request at '/userIdsPendingFriendships' endpoint in order to retrieve the ids of the users with which the main user has a pending friendship
export const getUserIdsPendingFriendships = (token) => {
  return dispatch => {
    axios({
      method:'get',
      url:'/userIdsPendingFriendships',
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      dispatch(addUserIdsPendingFriendships(res.data.data));
      dispatch(actions.createPusherObject(token));
    }).catch(err => {
      let errMsg = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(errMsg,null));
      dispatch(actions.endLoad());
    })
  };
};

// Makes a request at `/notification/${id}` endpoint in order to change the status of a notification. Payload includes the new status of the notification
export const changeNotificationStatus = (id,status,token) => {
  return dispatch => {
    if(status !== "removed"){
      // For a faster response the change of the status is done immediately if the status is different than "removed"
      dispatch(makeChangeToNotificationStatus(id,status));
    }else{
      dispatch(startIndividualLoad(id,'notifications'))
    }

    axios({
      method:'patch',
      url:`/notification/${id}`,
      data:{
        status: status
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if(status === "removed"){
        dispatch(removeNotification(id));
      }
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      if(status === "removed"){
        dispatch(endIndividualLoad(id,'notifications'))
      }
    });
  };
};

// Makes a request at `/friendship/${friendshipId}/handleAcceptOrReject` endpoint in order to respond to a friendship request.  Payload includes the status of the friendship "accepted" or "rejected"
export const handleFriendshipRequest = (friendshipId,friendshipStatus,notificationId,token) => {
  return (dispatch,getState) => {
    dispatch(startIndividualLoad(notificationId,'notifications'));

    axios({
      method:'post',
      url:`/friendship/${friendshipId}/handleAcceptOrReject`,
      data:{
        status: friendshipStatus
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if(friendshipStatus ==='accepted'){
        let mainUserId = getState().auth.userId;
        let friendId = res.data.data.user_id;
        let max = Math.max(mainUserId,friendId);
        let min = Math.min(mainUserId,friendId);
        // For more info check store->actions->pusher
        dispatch(actions.connectToPusherChannel(`private-chat.between.user.${min}.and.${max}`));
        dispatch(actions.connectToPusherChannel(`private-notifications.from.user.${friendId}`));

        dispatch(addUserInfo(res.data.data));
        // For more info check store->actions->messages
        dispatch(actions.createConvoContact(res.data.data.user_id,res.data.data.last_message));
      }

      // For more info check store->actions->app
      dispatch(actions.showMessage(res.data.info));
      dispatch(removeUserIdPendingFriendship(res.data.data.user_id));
      // Regardless of the response(accepted or rejected) the notification is removed after the response was processed.
      dispatch(removeNotification(notificationId));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endIndividualLoad(notificationId,'notifications'));
    })
  }
}

// Makes a request at `/friendship/${friendshipId}` endpoint in order to change the status of a friendship. This includes changing it to "removed" which will remove that contact. Payload includes the status of the friendship "accepted","blocked" or "removed"
export const changeFriendshipStatus = (friendshipId,userId,status,token) => {
  return (dispatch,getState) => {
    dispatch(startIndividualLoad(userId,'contacts'));

    axios({
      method:'patch',
      url:`/friendship/${friendshipId}`,
      data:{
        status: status
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res => {
      let otherStatus = getState().info.otherUsers[`info_user_${userId}`].other_status;
     
      if(status !== "removed"){
        dispatch(makeChangeToFriendshipStatus(userId,status));

        // Only if the status of both friendships is "accepted" wll the user be able to receive notifications from the contact via pusher
        if(status === 'accepted'){
          if(otherStatus === 'accepted'){
            dispatch(actions.connectToPusherChannel(`private-notifications.from.user.${userId}`));

            if(res.data.data.is_online){
              dispatch(showContactOnline(userId));
            }

            if(res.data.data.is_active){
              dispatch(showContactActive(userId));
            }
          }
          
          if(res.data.info?.messages){
            let infoMsgs = getState().messages.convosContacts[`convo_with_user_${userId}`].info;
            let currentLastMsg = getState().info.otherUsers[`info_user_${userId}`].last_message;

            if(infoMsgs.got_messages || !currentLastMsg){
              if(res.data.info.unread_messages > 0){
                dispatch(updateUnreadMessagesContact(userId,res.data.info.unread_messages));
              }
              
              dispatch(actions.addMessagesConvoContact(userId,res.data.info.messages,infoMsgs));

              let allMessages = getState().messages.convosContacts[`convo_with_user_${userId}`].messages;
              let lastMsgId = actions.getLatestMsgId(allMessages);
          
              if(currentLastMsg?.id !== lastMsgId){
                dispatch(replaceLastMessageContact(userId,allMessages[`info_message_${lastMsgId}`]));
              }
              
            }
          }
        }

        if(status === 'blocked' && otherStatus === 'accepted'){
          // If contact is blocked the user will appear as offline and inactive from now on.
          dispatch(showContactOffline(userId));
          dispatch(showContactInactive(userId));
          dispatch(actions.disconnectFromPusherChannel(`private-notifications.from.user.${userId}`));
        }

        dispatch(endIndividualLoad(userId,'contacts'));
      }else{
        let mainUserId = getState().auth.userId;
        let max = Math.max(mainUserId,userId);
        let min = Math.min(mainUserId,userId);

        // For more info check store->actions->pusher
        dispatch(actions.disconnectFromPusherChannel(`private-chat.between.user.${min}.and.${max}`));
        dispatch(actions.disconnectFromPusherChannel(`private-notifications.from.user.${userId}`));
        dispatch(removeUserInfo(userId));
        // For more info check store->actions->messages
        dispatch(actions.removeConvoContact(userId));
      }
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endIndividualLoad(userId,'contacts'));
    })

  }
}

// Makes a request at `/user/${mainUserId}/group/${groupId}` endpoint in order to leave the group. In is a delete request so there is no payload.
export const leaveGroup = (token,mainUserId,groupId)=> {
  return dispatch => {
    dispatch(startIndividualLoad(groupId,'groups'));

    axios({
      method:'delete',
      url:`/user/${mainUserId}/group/${groupId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      // For more info check store->actions->pusher
      dispatch(actions.disconnectFromPusherChannel(`private-notifications.group.${groupId}`));
      dispatch(actions.disconnectFromPusherChannel(`private-chat.group.${groupId}`));

      dispatch(removeGroup(groupId));
      // For more info check store->actions->messages
      dispatch(actions.removeConvoGroup(groupId));
      dispatch(actions.showMessage(res.data.info));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endIndividualLoad(groupId,'groups'));
    });
  }
}

// AC used to remove a groups info from redux when it is deleted by another member. For more info check Main comp.
export const groupWasDeleted = (groupId) => {
  return dispatch => {
    dispatch(removeGroup(groupId));
    dispatch(actions.removeConvoGroup(groupId));
  }
}

// Makes a request at `/group/${groupId}` endpoint in order to delete the group. In is a delete request so there is no payload.
export const deleteGroup = (token,groupId) => {
  return dispatch => {
    dispatch(startIndividualLoad(groupId,'groups'));

    axios({
      method:'delete',
      url:`/group/${groupId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      dispatch(actions.showMessage(res.data.message));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endIndividualLoad(groupId,'groups'));
    })
  }
}

// Makes a request at `/user/${mainUserId}` endpoint in order to change an attribute of the main user. The payload contains the attribute name and value as an object literal
export const changeMainUserInfo = (attribute,payload,mainUserId,token) => {
  return dispatch => {
    dispatch(startLoadMainUserInfo(attribute));

    let extraHeader = {};
    if(attribute === "image" && payload.image){
      // If there is an image, the addequate header is being added
      extraHeader['Content-type'] = 'multipart/form-data';

      var form = new FormData();
      // Form data can't be sent via patch request so method spoofing is applied, thus making a post request but the backend treats it as patch request. This is only applicable to the image, no need for method spoofing when changing another attribute
      form.append('_method','patch');
      for(let el in payload){
        form.append(el,payload[el]);
      }
    }

    axios({
      method:attribute === "image" && payload.image ? 'post' : 'patch',
      url:`/user/${mainUserId}`,
      data: attribute === "image" && payload.image ? form: payload,
      headers:{
        Authorization: `Bearer ${token}`,
        ...extraHeader
      }
    }).then(res => {
      dispatch(makeChangeToMainUserInfo(attribute,res.data.data[attribute]));

      if(attribute === "password"){
        // For more info check store->actions->app
        dispatch(actions.showMessage("Password was successfully changed"));
      }else if(attribute === "email"){
        // For more info check store->actions->auth
        dispatch(actions.logoutFromApp(token));
        // For more info check store->actions->app
        dispatch(actions.showMessage(`Your email was successfully changed to ${payload['email']}. Please verify so that you can log in and get back to chatting with your friends in no time`));
      }

      dispatch(endLoadMainUserInfo(attribute));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadMainUserInfo(attribute));
    })
  }
}

// Makes a post request at `/group` endpoint in order to create a group. The payload contains the groups attribute names along with their values as an object literal
export const createGroup = (payload,token,changeActiveInfo,changeActiveInfoColumn) => {
  return dispatch => {
    dispatch(startLoadGroupCreate());

    var form = new FormData();
    for(let el in payload){
      if(payload[el]){
        form.append(el,payload[el]);
      }
    }

    axios({
      method:'post',
      url:`/group`,
      data: form,
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-type':'multipart/form-data'
      }
    }).then(res => {
      let groupId = res.data.data.group_id;

      // For more info chec store->actions->pusher
      dispatch(actions.connectToPusherChannel(`private-notifications.group.${groupId}`));
      dispatch(actions.connectToPusherChannel(`private-chat.group.${groupId}`));

      dispatch(addGroup(res.data.data));
      // For more info check store->actions->messages
      dispatch(actions.createConvoGroup(groupId,res.data.data.last_message));
      // The next two functions are used to change the state in the Main comp and are passed as params to this AC
      changeActiveInfo('groups');
      changeActiveInfoColumn('infoMain');
      dispatch(actions.showMessage(res.data.info));
      dispatch(endLoadGroupCreate());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadGroupCreate());
    })
  };
};

// Makes a get request at `/user?username=${username}` endpoint in order to get the info about the users whose username match the search criteria entered by the main user(this is done in order to potentially add them to contacts). There is no payload but the username is passed as query parameter.
export const getContactsForAdd = (username,token) => {
  return dispatch => {
    dispatch(startLoadContactsForAdd());

    axios({
      method:'get',
      url:`/user?username=${username}`,
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res => {
      dispatch(addContactsForAdd(res.data.data,res.data.info));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(clearContactsForAdd());
    })
  };
};

// Makes a post request at `/user?username=${username}` endpoint in order to send a friendship request or directly add the user as a contact if he has the main user in the contact list with frienship status 'accepted'. Payload contains 'friend_id' prop name with the id of user you want to add as the value.
export const sendFriendshipRequest = (token,resetSearchedValue,changeActiveInfoColumn,friendId,groupId) => {
  return (dispatch,getState) => {
    if(!groupId){
      dispatch(startLoadContactsForAdd());
    }else{
      dispatch(startLoadMembersAction());
    }

    axios({
      method:'post',
      url:'/friendship',
      data:{
        friend_id:friendId
      },
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res => {
      // Checking if there is data in the response, in order to determine if a friendship request was sent or if the user can be added directly to contacts. In case of the former the necessary info is provided by the server and in case of the latter a message is provided by the server.
      if(res.data.data){
        let mainUserId = getState().auth.userId;
        let max = Math.max(mainUserId,friendId);
        let min = Math.min(mainUserId,friendId);

        // For more info check store->actions->pusher
        dispatch(actions.connectToPusherChannel(`private-chat.between.user.${min}.and.${max}`));
        dispatch(actions.connectToPusherChannel(`private-notifications.from.user.${friendId}`));

        dispatch(addUserInfo(res.data.data));
        // For more info check store->actions->messages
        dispatch(actions.createConvoContact(res.data.data.user_id,res.data.data.last_message));
        dispatch(actions.showMessage(res.data.info));
        if(!groupId){
          changeActiveInfoColumn('infoMain');
        }else{
          dispatch(endLoadMembersAction());
        }
      }else if(res.data.message){
        dispatch(addUserIdPendingFriendship(friendId));
        dispatch(actions.showMessage(res.data.message));
        if(!groupId){
          resetSearchedValue();
          dispatch(clearContactsForAdd());
        }else{
          dispatch(endLoadMembersAction());
        }
      }
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      if(!groupId){
        dispatch(clearContactsForAdd());
      }else{
        dispatch(endLoadMembersAction());
      }
    })
  };
};

// Makes a get request at `/friendship/${friendshipId}/resetUnreadMessages` endpoint in order to reset the number of unread messages in a chat with a contact. 
export const resetUnreadMessagesContact = (token,friendshipId,userId) => {
  return dispatch => {
    axios({
      method:'get',
      url:`/friendship/${friendshipId}/resetUnreadMessages`,
      headers:{
        Authorization: `Bearer ${token}`,
        "X-Socket-Id": window.myPusher.connection.socket_id
      }
    }).then(res=>{
      dispatch(makeResetUnreadMessagesContact(userId));
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
    })
  };
};

// Makes a get request at `group/${groupId}/resetUnreadMessages` endpoint in order to reset the number of unread messages in a group chat. 
export const resetUnreadMessagesGroup = (token,groupId) => {
  return dispatch => {
    axios({
      method:'get',
      url:`group/${groupId}/resetUnreadMessages`,
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res=>{
      dispatch(makeResetUnreadMessagesGroup(groupId));
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
    })
  };
};

// Makes a patch request at `/friendship/${friendshipId}` endpoint in order to change the alias of a contact. The payload contains the 'alias' name and its value as an object literal. 
export const changeAlias = (attribute,payload,userId,friendshipId,token) => {
  return dispatch => {
    dispatch(startLoadChangeAlias());

    axios({
      method:'patch',
      url:`/friendship/${friendshipId}`,
      data:payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      dispatch(makeChangeToAlias(userId,res.data.data[attribute]));
      dispatch(endLoadChangeAlias());
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadChangeAlias());
    })
  };
};

// Makes a patch request at `/group/${groupId}` endpoint in order to change an attribute of a group(name,image etc.). It is only used if the user has the necessary permission to make such a thing. The payload contains the attribute name and its value as an object literal. 
export const changeGroupInfo = (attribute,payload,groupId,token) => {
  return dispatch => {
    dispatch(startLoadChangeGroupInfo(attribute));

    let extraHeader = {};
    if(attribute === "image" && payload.image){
      // Adding the necessary header if the attribute is the image
      extraHeader['Content-type'] = 'multipart/form-data';

      var form = new FormData();
      // Form data can't be sent via patch request so method spoofing is applied, thus making a post request but the backend treats it as patch request. This is only applicable to the image, no need for method spoofing when changing another attribute
      form.append('_method','patch');
      form.append(attribute,payload[attribute]);
    }

    axios({
      method:attribute === "image" && payload.image ? 'post' : 'patch',
      url:`/group/${groupId}`,
      data: attribute === "image" && payload.image ? form: payload,
      headers:{
        Authorization: `Bearer ${token}`,
        ...extraHeader
      }
    }).then(res => {
      dispatch(endLoadChangeGroupInfo(attribute));
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadChangeGroupInfo(attribute));
    })
  };
};

// Makes a post request at `/user/group` endpoint in order to add a contact to group(contact can be added only if both friendships have 'accepted' status). The payload is composed of the group id and the user id as an object literal.
export const addContactToGroup = (token,groupId,contact) => {
  return dispatch => {
    dispatch(startLoadAddContactToGroup());

    axios({
      method:'post',
      url:`/user/group`,
      data: {
        group_id:groupId,
        user_id:contact.user_id
      },
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res=>{
      dispatch(actions.showMessage(res.data.message));
      dispatch(endLoadAddContactToGroup());
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadAddContactToGroup());
    })
  };
};

// Makes a delete request at `/user/${userId}/group/${groupId}` endpoint in order to remove a contact from a group(this can only be done if the main user has the necessary permission). 
export const removeGroupMember = (token,groupId,userId) => {
  return dispatch => {
     dispatch(startLoadMembersAction());

     axios({
      method:'delete',
      url:`/user/${userId}/group/${groupId}`,
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res=>{
      dispatch(actions.showMessage(res.data.info));
      dispatch(endLoadMembersAction());
    }).catch(err=>{
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadMembersAction());
    })
  };
};

// Makes a patch request at `/user/${userId}/group/${groupId}` endpoint in order to change the permission of a group member for a certain group(this can only be done if the main user has the necessary permission). Payload contains the permission id as an obj literal.
export const updatePermissionGroupMember = (token,groupId,permission,userId) => {
  return dispatch => {
    dispatch(startLoadMembersAction());

    axios({
      method:'patch',
      url:`/user/${userId}/group/${groupId}`,
      data:{
        permission_id: getPermissionId(permission)
      },
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }).then(res => {
      dispatch(actions.showMessage(res.data.message));
      dispatch(endLoadMembersAction());
    }).catch(err => {
      let error = err.response ? err.response.data.error : err.message;

      dispatch(actions.showErrorMessage(error,null));
      dispatch(endLoadMembersAction());
    })
  };
};

// Helper function used to get the permission id based on the name as defined in the db.
const getPermissionId = (permName) => {
  if(permName === "Regular"){
    return 1;
  }else if(permName === "Admin"){
    return 2;
  }else if(permName === "Add/Remove"){
    return 3;
  }else if(permName === "Edit"){
    return 4;
  }
}

// Resets the info in the info reducer, thus having the initial store info.
export const clearInfo = () => {
  return {
    type:actionTypes.CLEAR_INFO
  };
};


