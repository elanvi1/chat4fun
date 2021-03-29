import * as actionTypes from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  loadingMainUserInfo:{
    name:false,
    username:false,
    about:false,
    email:false,
    image:false,
    password:false
  },
  loadingGroupInfo:{
    name:false,
    description:false,
    image:false
  },
  contactsForAdd:{
    loading:false,
    message:'',
    list:null
  },
  loadingChangeAlias:false,
  loadingCreateGroup:false,
  loadingAddContactToGroup:false,
  loadingMembersAction:false,
  mainUser:null,
  otherUsers: null,
  groups: null,
  notifications:null,
  userIdsPendingFriendships:[],
  activeGroupId: 0
}

const reducer = (state=initialState,action) => {
  let category = '';
  let individual = '';

  switch(action.type){
    case actionTypes.ADD_MAIN_USER_INFO:
      return {
        ...state,
        mainUser: action.mainUserInfo
      }
    case actionTypes.ADD_OTHER_USERS_INFO:
      return {
        ...state,
        otherUsers: action.otherUsersInfo
      }
    case actionTypes.ADD_GROUPS_INFO:
      return{
        ...state,
        groups: action.groupsInfo
      }
    case actionTypes.ADD_NOTIFICATIONS_INFO:
      return {
        ...state,
        notifications:action.notificationsInfo
      }
    case actionTypes.ADD_USER_IDS_PENDING_FRIENDSHIPS:
      return {
        ...state,
        userIdsPendingFriendships:action.ids
      }
    case actionTypes.ADD_USER_ID_PENDING_FRIENDSHIP:
      let newUserIdsAdd = [...state.userIdsPendingFriendships];
      newUserIdsAdd.push(action.id);

      return {
        ...state,
        userIdsPendingFriendships:newUserIdsAdd
      }
    case actionTypes.REMOVE_USER_ID_PENDING_FRIENDSHIP:
      let newUserIdsRemove = state.userIdsPendingFriendships.filter(item => item !== action.id);

      return {
        ...state,
        userIdsPendingFriendships:newUserIdsRemove
      }
    case actionTypes.CHANGE_NOTIFICATION_STATUS:
      return {
        ...state,
        notifications:{
          ...state.notifications,
          [`info_notification_${action.id}`]:{
            ...state.notifications[`info_notification_${action.id}`],
            status:action.status
          }
        }
      }
    case actionTypes.CHANGE_NOTIFICATION_EXTENSION:
      return {
        ...state,
        notifications:{
          ...state.notifications,
          [`info_notification_${action.id}`]:{
            ...state.notifications[`info_notification_${action.id}`],
            minimized:state.notifications[`info_notification_${action.id}`].minimized === true ? false: true
          }
        }
      }
    case actionTypes.START_INDIVIDUAL_LOAD:
      

      if(action.activeType === 'contacts'){
        category = 'otherUsers';
        individual = `info_user_${action.id}`;
      }else if(action.activeType === 'groups'){
        category = 'groups';
        individual = `info_group_${action.id}`;
      }else if(action.activeType === 'notifications'){
        category = 'notifications';
        individual = `info_notification_${action.id}`;
      }

      return {
        ...state,
        [category]:{
          ...state[category],
          [individual]:{
            ...state[category][individual],
            loading:true
          }
        }
      }

    case actionTypes.END_INDIVIDUAL_LOAD:
      if(action.activeType === 'contacts'){
        category = 'otherUsers';
        individual = `info_user_${action.id}`;
      }else if(action.activeType === 'groups'){
        category = 'groups';
        individual = `info_group_${action.id}`;
      }else if(action.activeType === 'notifications'){
        category = 'notifications';
        individual = `info_notification_${action.id}`;
      }

      return {
        ...state,
        [category]:{
          ...state[category],
          [individual]:{
            ...state[category][individual],
            loading:false
          }
        }
      }
    case actionTypes.ADD_NOTIFICATION:
      let newNotificationAdd = {
        ...action.notification,
        status:"unread",
        created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        minimized:true,
        loading:false
      }
      
      return {
        ...state,
        notifications:{
          ...state.notifications,
          [`info_notification_${action.notification.id}`]:newNotificationAdd
        }
      }
    case actionTypes.REMOVE_NOTIFICATION:
      let newNotifications = {};

      for(let notification in state.notifications){
        if(state.notifications[notification].id !== action.id){
          newNotifications[notification] = {...state.notifications[notification]}
        }
      }

      return {
        ...state,
        notifications:newNotifications
      }
    case actionTypes.ADD_USER_INFO:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.userInfo.user_id}`]:action.userInfo
        }
      }
    case actionTypes.REMOVE_USER_INFO:
      let newOtherUsers = {};

      for(let contactInfo in state.otherUsers){
        if(state.otherUsers[contactInfo].user_id !== action.id){
          newOtherUsers[contactInfo] = {...state.otherUsers[contactInfo]}
        }
      }

      return {
        ...state,
        otherUsers:newOtherUsers
      }

    case actionTypes.CHANGE_FRIENDSHIP_STATUS:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            status:action.status
          }
        }
      }
    case actionTypes.CHANGE_FRIENDSHIP_OTHER_STATUS:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            other_status:action.status
          }
        }
      }
    case actionTypes.ADD_GROUP:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupInfo.group_id}`]:action.groupInfo
        }
      }
    case actionTypes.REMOVE_GROUP:
      let newGroups = {};

      for(let group in state.groups){
        if(state.groups[group].group_id !== action.id){
          newGroups[group] = {...state.groups[group]}
        }
      }

      return {
        ...state,
        groups:newGroups
      }
    case actionTypes.CHANGE_IS_DELETED_GROUP_ATTR:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            isDeleted:true
          }
        }
      }
    case actionTypes.START_LOAD_GROUP_CREATE:
      return {
        ...state,
        loadingCreateGroup:true
      }
    case actionTypes.END_LOAD_GROUP_CREATE:
      return {
        ...state,
        loadingCreateGroup:false
      }
    case actionTypes.CHANGE_MAIN_USER_INFO:
      return {
        ...state,
        mainUser:{
          ...state.mainUser,
          [action.attribute]:action.value
        }
      }
    case actionTypes.CHANGE_CONTACT_INFO:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.info.user_id}`]:{
            ...state.otherUsers[`info_user_${action.info.user_id}`],
            ...action.info
          }
        }
      }
    case actionTypes.START_LOAD_MAIN_USER_INFO:
      return {
        ...state,
        loadingMainUserInfo:{
          ...state.loadingMainUserInfo,
          [action.attribute]:true
        }
      }
    case actionTypes.END_LOAD_MAIN_USER_INFO:
      return {
        ...state,
        loadingMainUserInfo:{
          ...state.loadingMainUserInfo,
          [action.attribute]:false
        }
      }
    case actionTypes.START_LOAD_CONTACTS_FOR_ADD:
      return {
        ...state,
        contactsForAdd:{
          ...state.contactsForAdd,
          loading:true
        }
      }
    case actionTypes.ADD_CONTACTS_FOR_ADD:
      return {
        ...state,
        contactsForAdd:{
          loading:false,
          message:action.message,
          list:action.list
        }
      }
    case actionTypes.CLEAR_CONTACTS_FOR_ADD:
      return {
        ...state,
        contactsForAdd:{
          loading:false,
          message:'',
          list:null
        }
      }
    case actionTypes.RESET_UNREAD_MESSAGES_CONTACT:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.userId}`]:{
            ...state.otherUsers[`info_user_${action.userId}`],
            unread_messages:0
          }
        }
      }
    case actionTypes.RESET_UNREAD_MESSAGES_GROUP:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            unread_messages:0
          }
        }
      }
    case actionTypes.REPLACE_LAST_MESSAGE_CONTACT:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.userId}`]:{
            ...state.otherUsers[`info_user_${action.userId}`],
            last_message:action.lastMessage
          }
        }
      }
    case actionTypes.REPLACE_LAST_MESSAGE_GROUP:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            last_message:action.lastMessage
          }
        }
      }
    case actionTypes.START_LOAD_CHANGE_ALIAS:
      return {
        ...state,
        loadingChangeAlias:true
      }
    case actionTypes.END_LOAD_CHANGE_ALIAS:
      return {
        ...state,
        loadingChangeAlias:false
      }
    case actionTypes.CHANGE_ALIAS:
      let updatedGroups = {};
      for(let group in state.groups){
        if(state.groups[group].members[`info_user_${action.userId}`]){
          updatedGroups[group] = {
            ...state.groups[group],
            members:{
              ...state.groups[group].members,
              [`info_user_${action.userId}`]:{
                ...state.groups[group].members[`info_user_${action.userId}`],
                alias:action.alias
              }
            }
          }
        }
      }

      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.userId}`]:{
            ...state.otherUsers[`info_user_${action.userId}`],
            alias:action.alias
          }
        },
        groups:{
          ...state.groups,
          ...updatedGroups
        }
      }
    case actionTypes.START_LOAD_CHANGE_GROUP_INFO:
      return{
        ...state,
        loadingGroupInfo:{
          ...state.loadingGroupInfo,
          [action.attribute]:true
        }
      }
    case actionTypes.END_LOAD_CHANGE_GROUP_INFO:
      return{
        ...state,
        loadingGroupInfo:{
          ...state.loadingGroupInfo,
          [action.attribute]:false
        }
      }
    case actionTypes.CHANGE_GROUP_INFO:
      return{
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            ...action.attrObj
          }
        }
      }
    case actionTypes.START_LOAD_ADD_CONTACT_TO_GROUP:
      return {
        ...state,
        loadingAddContactToGroup: true
      }
    case actionTypes.END_LOAD_ADD_CONTACT_TO_GROUP:
      return {
        ...state,
        loadingAddContactToGroup: false
      }
    case actionTypes.USER_WAS_ADDED_TO_GROUP:{
      let alias = null;

      if(state.otherUsers[`info_user_${action.userInfo.id}`]){
        alias = state.otherUsers[`info_user_${action.userInfo.id}`].alias;
      }

      let newUserInfo = {...action.userInfo,alias:alias}
      
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            members:{
              ...state.groups[`info_group_${action.groupId}`].members,
              [`info_user_${action.userInfo.id}`]: newUserInfo
            }
          }
        }
      }
    }
    case actionTypes.START_LOAD_MEMBERS_ACTION:
      return {
        ...state,
        loadingMembersAction:true
      }
    case actionTypes.END_LOAD_MEMBERS_ACTION:
      return {
        ...state,
        loadingMembersAction:false
      }
    case actionTypes.REMOVE_GROUP_MEMBER:
      let newGroupMembers = {...state.groups[`info_group_${action.groupId}`].members};
      delete newGroupMembers[`info_user_${action.userId}`];
      
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            members:newGroupMembers
          }
        }
      }
      
    case actionTypes.UPDATE_GROUP_MEMBER_INFO:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            members:{
              ...state.groups[`info_group_${action.groupId}`].members,
              [`info_user_${action.info.id}`]:{
                ...state.groups[`info_group_${action.groupId}`].members[`info_user_${action.info.id}`],
                ...action.info
              }
            }
          }
        }
      }
    case actionTypes.UPDATE_PERMISSION_MAIN_USER:
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            permission:action.permission
          }
        }
      }
    case actionTypes.SHOW_CONTACT_ONLINE:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            is_online:true
          }
        }
      }
    case actionTypes.SHOW_CONTACT_OFFLINE:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            is_online:false
          }
        }
      }
    case actionTypes.SHOW_CONTACT_ACTIVE:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            is_active:true
          }
        }
      }
    case actionTypes.SHOW_CONTACT_INACTIVE:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            is_active:false
          }
        }
      }
    case actionTypes.UPDATE_UNREAD_MESSAGES_CONTACT:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.id}`]:{
            ...state.otherUsers[`info_user_${action.id}`],
            unread_messages:action.unreadMessages
          }
        }
      }
    case actionTypes.INCREASE_UNREAD_MESSAGES_GROUP:
      let newUnreadMessages = state.groups[`info_group_${action.groupId}`].unread_messages + 1;
      
      return {
        ...state,
        groups:{
          ...state.groups,
          [`info_group_${action.groupId}`]:{
            ...state.groups[`info_group_${action.groupId}`],
            unread_messages:newUnreadMessages
          }
        }
      }
    case actionTypes.MARK_LAST_MESSAGE_AS_READ:
      return {
        ...state,
        otherUsers:{
          ...state.otherUsers,
          [`info_user_${action.userId}`]:{
            ...state.otherUsers[`info_user_${action.userId}`],
            last_message:{
              ...state.otherUsers[`info_user_${action.userId}`].last_message,
              status:'read'
            }
          }
        }
      }
    case actionTypes.MAKE_GROUP_ACTIVE:
      return {
        ...state,
        activeGroupId: action.groupId
      }
    case actionTypes.MAKE_GROUP_INACTIVE:
      return {
        ...state,
        activeGroupId: 0
      }
    case actionTypes.CLEAR_INFO:
      return initialState;
    default:
      return state
  }
}

export default reducer;