// Creating constants to hold action types in order to use in action creators and reducers. This is done in order to reduce misspelling errors.
export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';

export const START_LOAD = 'START_LOAD';
export const END_LOAD = 'END_LOAD';

export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE';
export const REMOVE_ERROR_MESSAGE = 'REMOVE_ERROR_MESSAGE';

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';

export const ADD_MAIN_USER_INFO = 'ADD_MAIN_USER_INFO';
export const ADD_OTHER_USERS_INFO = 'ADD_OTHER_USERS_INFO';
export const ADD_GROUPS_INFO = 'ADD_GROUPS_INFO';
export const ADD_NOTIFICATIONS_INFO = 'ADD_NOTIFICATIONS_INFO';
export const ADD_USER_IDS_PENDING_FRIENDSHIPS = 'ADD_USER_IDS_PENDING_FRIENDSHIPS';
export const REMOVE_USER_ID_PENDING_FRIENDSHIP = "REMOVE_USER_ID_PENDING_FRIENDSHIP";
export const ADD_USER_ID_PENDING_FRIENDSHIP = "ADD_USER_ID_PENDING_FRIENDSHIP";
export const CHANGE_NOTIFICATION_STATUS = 'CHANGE_NOTIFICATION_STATUS';
export const CHANGE_NOTIFICATION_EXTENSION = 'CHANGE_NOTIFICATION_EXTENSION';
export const START_INDIVIDUAL_LOAD = 'START_INDIVIDUAL_LOAD';
export const END_INDIVIDUAL_LOAD = 'END_INDIVIDUAL_LOAD';
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const ADD_USER_INFO = 'ADD_USER_INFO';
export const REMOVE_USER_INFO = "REMOVE_USER_INFO";
export const CHANGE_FRIENDSHIP_STATUS = "CHANGE_FRIENDSHIP_STATUS";
export const CHANGE_FRIENDSHIP_OTHER_STATUS = "CHANGE_FRIENDSHIP_OTHER_STATUS";
export const ADD_GROUP = "ADD_GROUP";
export const REMOVE_GROUP = "REMOVE_GROUP";
export const CHANGE_IS_DELETED_GROUP_ATTR = "CHANGE_IS_DELETED_GROUP_ATTR";
export const START_LOAD_GROUP_CREATE = "START_LOAD_GROUP_CREATE";
export const END_LOAD_GROUP_CREATE = "END_LOAD_GROUP_CREATE";
export const CHANGE_MAIN_USER_INFO = "CHANGE_MAIN_USER_INFO";
export const CHANGE_CONTACT_INFO = "CHANGE_CONTACT_INFO";
export const START_LOAD_MAIN_USER_INFO = "START_LOAD_MAIN_USER_INFO";
export const END_LOAD_MAIN_USER_INFO = "END_LOAD_MAIN_USER_INFO";
export const START_LOAD_CONTACTS_FOR_ADD = "START_LOAD_CONTACTS_FOR_ADD";
export const ADD_CONTACTS_FOR_ADD = "ADD_CONTACTS_FOR_ADD";
export const CLEAR_CONTACTS_FOR_ADD = "CLEAR_CONTACTS_FOR_ADD";
export const RESET_UNREAD_MESSAGES_CONTACT = "RESET_UNREAD_MESSAGES_CONTACT";
export const RESET_UNREAD_MESSAGES_GROUP = "RESET_UNREAD_MESSAGES_GROUP";
export const REPLACE_LAST_MESSAGE_CONTACT = "REPLACE_LAST_MESSAGE_CONTACT";
export const REPLACE_LAST_MESSAGE_GROUP = "REPLACE_LAST_MESSAGE_GROUP";
export const START_LOAD_CHANGE_ALIAS = "START_LOAD_CHANGE_ALIAS";
export const END_LOAD_CHANGE_ALIAS = "END_LOAD_CHANGE_ALIAS";
export const CHANGE_ALIAS = "CHANGE_ALIAS";
export const START_LOAD_CHANGE_GROUP_INFO = "START_LOAD_CHANGE_GROUP_INFO";
export const END_LOAD_CHANGE_GROUP_INFO = "END_LOAD_GROUP_INFO";
export const CHANGE_GROUP_INFO = "CHANGE_GROUP_INFO";
export const START_LOAD_ADD_CONTACT_TO_GROUP = "START_LOAD_ADD_CONTACT_TO_GROUP";
export const END_LOAD_ADD_CONTACT_TO_GROUP = "END_LOAD_ADD_CONTACT_TO_GROUP";
export const USER_WAS_ADDED_TO_GROUP = "USER_WAS_ADDED_TO_GROUP";
export const START_LOAD_MEMBERS_ACTION = "START_LOAD_MEMBERS_ACTION";
export const END_LOAD_MEMBERS_ACTION = "END_LOAD_MEMBERS_ACTION";
export const REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";
export const UPDATE_PERMISSION_MAIN_USER = "UPDATE_PERMISSION_MAIN_USER";
export const SHOW_CONTACT_ONLINE = "SHOW_CONTACT_ONLINE";
export const SHOW_CONTACT_OFFLINE = "SHOW_CONTACT_OFFLINE";
export const SHOW_CONTACT_ACTIVE = "SHOW_CONTACT_ACTIVE";
export const SHOW_CONTACT_INACTIVE = "SHOW_CONTACT_INACTIVE";
export const UPDATE_UNREAD_MESSAGES_CONTACT = "UPDATE_UNREAD_MESSAGES_CONTACT";
export const INCREASE_UNREAD_MESSAGES_GROUP = 'INCREASE_UNREAD_MESSAGES_GROUP';
export const MARK_LAST_MESSAGE_AS_READ = "MARK_LAST_MESSAGE_AS_READ";
export const UPDATE_GROUP_MEMBER_INFO = "UPDATE_GROUP_MEMBER_INFO";
export const MAKE_GROUP_ACTIVE = "MAKE_GROUP_ACTIVE";
export const MAKE_GROUP_INACTIVE = "MAKE_GROUP_INACTIVE";
export const CLEAR_INFO = "CLEAR_INFO";


export const CREATE_CONVO_CONTACT = "CREATE_CONVO_CONTACT";
export const CREATE_CONVO_GROUP = "CREATE_CONVO_GROUP";
export const GET_MESSAGES_CONVO_CONTACT = "GET_MESSAGES_CONVO_CONTACT";
export const GET_MESSAGES_CONVO_GROUP = "GET_MESSAGES_CONVO_GROUP";
export const START_LOAD_GET_MESSAGES_CONVO = "START_LOAD_GET_MESSAGES_CONVO";
export const END_LOAD_GET_MESSAGES_CONVO = "END_LOAD_GET_MESSAGES_CONVO";
export const START_LOAD_GET_ADDITIONAL_MSGS_CONVO = "START_LOAD_GET_ADDITIONAL_MSGS_CONVO";
export const END_LOAD_GET_ADDITIONAL_MSGS_CONVO = "END_LOAD_GET_ADDITIONAL_MSGS_CONVO";
export const REMOVE_CONVO_CONTACT = "REMOVE_CONVO_CONTACT";
export const REMOVE_CONVO_GROUP = "REMOVE_CONVO_GROUP";
export const ADD_TEMP_MESSAGE_CONVO_CONTACT = "ADD_TEMP_MESSAGE_CONVO_CONTACT";
export const ADD_TEMP_MESSAGE_CONVO_GROUP = "ADD_TEMP_MESSAGE_CONVO_GROUP";
export const ADD_NEW_MESSAGE_CONVO_CONTACT = "ADD_NEW_MESSAGE_CONVO_CONTACT";
export const ADD_NEW_MESSAGE_CONVO_GROUP = "ADD_NEW_MESSAGE_CONVO_GROUP";
export const REMOVE_MESSAGE_CONVO_CONTACT = "REMOVE_MESSAGE_CONVO_CONTACT";
export const REMOVE_MESSAGE_CONVO_GROUP = "REMOVE_MESSAGE_CONVO_GROUP";
export const MARK_MESSAGES_AS_READ = "MARK_MESSAGES_AS_READ";
export const ADD_GROUP_NOTIFICATION = "ADD_GROUP_NOTIFICATION";
export const CLEAR_MESSAGES = "CLEAR_MESSAGES";

export const ADD_PUSHER_CHANNEL = "ADD_PUSHER_CHANNEL";
export const REMOVE_PUSHER_CHANNEL = "REMOVE_PUSHER_CHANNEL";
export const SET_TOTAL_NUMBER_OF_CHANNELS = "SET_TOTAL_NUMBER_OF_CHANNELS";
export const INCREASE_NR_CHANNELS_GOT_RESP = "INCREASE_NR_CHANNELS_GOT_RESP";
export const CLEAR_PUSHER = "CLEAR_PUSHER";

