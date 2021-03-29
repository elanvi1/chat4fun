// File used in order to simplify the workflow, so that all action creators are exported from one file.
export {
  startLoad,
  endLoad,
  showErrorMessage,
  removeErrorMessage,
  showMessage,
  removeMessage
} from './app';

export {
  login,
  handleLogInErrorLinks,
  logoutFromApp,
  authCheckState,
  register,
  showOnline,
  showOffline,
  showActive,
  showInactive,
  deactivateAccount
} from './auth';


export {
  getMainUserInfo,
  changeNotificationStatus,
  changeNotificationExtension,
  handleFriendshipRequest,
  changeFriendshipStatus,
  changeFriendshipOtherStatus,
  leaveGroup,
  groupWasDeleted,
  changeGroupIsDeletedAttr,
  deleteGroup,
  changeMainUserInfo,
  changeContactInfo,
  createGroup,
  addGroup,
  clearContactsForAdd,
  getContactsForAdd,
  sendFriendshipRequest,
  resetUnreadMessagesContact,
  resetUnreadMessagesGroup,
  replaceLastMessageContact,
  replaceLastMessageGroup,
  changeAlias,
  changeGroupInfo,
  makeChangeToGroupInfo,
  addContactToGroup,
  userWasAddedToGroup,
  removeGroupMember,
  makeRemovalOfGroupMember,
  updatePermissionGroupMember,
  updatePermissionMainUser,
  addNotification,
  addUserInfo,
  showContactOnline,
  showContactOffline,
  showContactActive,
  showContactInactive,
  markLastMessageAsRead,
  updateUnreadMessagesContact,
  increaseUnreadMessagesGroup,
  updateGroupMemberInfo,
  makeGroupActive,
  makeGroupInactive,
  clearInfo,
} from './info';

export {
  createConvoContact,
  createConvoGroup,
  getMessagesConvo,
  removeConvoContact,
  removeConvoGroup,
  removeMessageConvoContact,
  removeMessageConvoGroup,
  clearMessages,
  sendMessage,
  addNewMessageConvoContact,
  addNewMessageConvoGroup,
  deleteMessage,
  markMessagesAsRead,
  addGroupNotification,
  addMessagesConvoContact
} from './messages';

export {
  createPusherObject,
  addPusherChannel,
  bindEventsToChannel,
  connectToPusherChannel,
  disconnectFromPusherChannel,
  getLatestMsgId,
  clearPusher
} from './pusher';