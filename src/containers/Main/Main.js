import React, { Component } from "react";
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';

import classes from './Main.module.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import InfoMain from '../../components/Info/InfoMain/InfoMain';
import InfoUser from '../InfoUser/InfoUser';
import CreateGroup from '../CreateGroup/CreateGroup';
import AddContact from '../../components/Info/AddContact/AddContact';
import MessagesMain from '../Messages/MessagesMain/MessagesMain';
import MessagesInfoContact from '../Messages/MessagesInfoContact/MessagesInfoContact';
import MessagesInfoGroup from '../Messages/MessagesInfoGroup/MessagesInfoGroup';
import FirstShow from '../../components/Messages/FirstShow/FirstShow';
import * as actions from '../../store/actions/index';

// ------------------OVERVIEW--------------------------------
// The project has one big component that ecompasses everything, called Main. Main has 2 parts/columns(not components): Info and Messages. 

// Info represents the left side/column and includes the following components: InfoMain, InfoUser, CreateGroup and AddContact

// Messages represents the right side/column and includes the following components: MessagesMain, MessagesInfoGroup and MessagesInfoContact

// InfoMain and MessagesMain/FirstShow are the main components of their respective part. InfoMain shows directly when first opening the app and MessagesMain shows when clicking a contact or group in the InfoMain component.

// The secondary components for Info are:
// - InfoUser : shows when clicking the Edit button from InfoMain header
// - CreateGroup: shows when selecting the Create Group option from the addition menu which is opened via the addition menu button situated in the header of InfoMain
// - AddContact: shows when selecting the Add Contact option from the addition menu which is opened via the addition menu button situated in the header of InfoMain

// The secondary components for Messages are:
// - MessagesInfoGroup: shows when clicking the Info Group button from the MessagesMain comp(assuming a group is selected)
// - MessagesInfoContact: shows when clicking the Info Contact button from the MessagesMain comp(assuming a contact is selected)


// On the Info part/column only one of the above mentioned components can be visible, be it main or secondary.

// On the Messages part/column both the main and a secondary component can be visible, if the width is large enough. (check below when they are used for more info)

// Both Info and Messages parts/columns are visible if the width is large enough(heck below when they are used for more info)

// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
// ----------------------------------------------------------

// CSS animation timings for the main components
const animationTimingPrimary = {
  enter: 0,
  exit: 100
};

// CSS animation timings for the secondary components
const animationTimingSecondary = {
  enter: 100,
  exit: 100
};

class Main extends Component{
// State includes the following:
//  -searchedValueInfo : this is the value entered by the user in order to find a group, contact or notification
//  -searchedValueContactAdd: this is the value entered by the user , inside the AddContact comp, when searching  for a contact to add to the contact list
//  - activeInfo: decides what to show on InfoMain: contacts, groups or notifications
//  - dropDownAddition: toggles the visibility of the addition menu
//  - selectedContactId: shows the id of contact that is selected, if a group is selected it becomes 0
//  - dropDown: is used to toggle the visibility of the actions menu for each IndividualMiniInfo comp
//  - activeInfoColumn: shows which component is visible in the Info part/column
//  - width: represents the width of the viewport, it readjust when it resizes
//  - activeOnMain: shows which part/column is visible if the width isn't big enough
//  - activeOnMessages: shows which component is visible in the Messages part/column if the width isn't big enough

  state = {
    searchedValueInfo: '',
    searchedValueContactAdd:'',
    activeInfo: {
      contacts:true,
      groups:false,
      notifications:false
    },
    dropDownAddition:false,
    selectedContactId:0,
    selectedGroupId:0,
    dropDown:{
      id:0,
      show:false
    },
    activeInfoColumn:{
      infoMain:true,
      infoUser:false,
      addContact:false,
      createGroup:false
    },
    width: window.innerWidth,
    activeOnMain:{
      info:true,
      messages:false
    },
    activeMessages:{
      main:true,
      info:false
    }
  }

  // A constructor is used in order to pass the class context to certain methods
  constructor(props){
    super(props);

    this.handleWindowClose = this.handleWindowClose.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  // When the component mounts 3 event listeners are added, each with its own purpose. See function declarations for more info
  componentDidMount(){
    window.addEventListener('resize',this.updateWidthOnResize);
    window.onbeforeunload = this.handleWindowClose;
    window.onunload = this.handleWindowClose;
    document.onvisibilitychange = this.handleVisibilityChange;
  };

  // When a group was deleted by another member the is_deleted attr of that group is set to true. We check in componentDidUpdate for such an update in order to remove the group and the conversation. For more info check store->actions->info and store->actions->pusher

  componentDidUpdate(prevProps,prevState){
    if(this.props.groupsInfo){
      for(let el in this.props.groupsInfo){
        if(this.props.groupsInfo[el].isDeleted && !prevProps.groupsInfo[el].isDeleted){
          this.handleGroupWasDeleted(this.props.groupsInfo[el].group_id);
        }
      }
    }
  }

  // The 3 event listeners are removed when the component unmounts
  componentWillUnmount(){
    window.removeEventListener('resize',this.updateWidthOnResize);
    window.onbeforeunload = null;
    window.onunload = null;
    document.onvisibilitychange = null;
  }

  // This shows the user as offline to his contacts assuming that both friendships have accepted status
  handleWindowClose(e){
    this.props.onShowOffline(this.props.token);
    return ;
  }

  handleVisibilityChange(){
    if(document.visibilityState === 'visible'){
      // This part handles a visibility change from hidden to visible of the tab in which the app runs.

      // The user is shown Online to his contacts assuming that both friendships have accepted status
      // For more info check store->actions->info
      this.props.onShowOnline(this.props.token);
      
      if(this.state.selectedContactId){
        // If a certain contact is selected then it will the user as active on their chat, there is a backend attr to keep track of this. 
        // For more info check store->actions->info
        this.props.onShowActive(this.props.token,this.state.selectedContactId);

        // If a contact is selected and there are any unread messages from that contact, the unread_messages attr is set to 0 both on the front_end and back_end. Also the messages are marked as read(2 check marks) for the other contact
        // For more info check store->actions->info
        if(this.props.otherUsersInfo[`info_user_${this.state.selectedContactId}`].unread_messages > 0){
          this.props.onResetUnreadMessagesContact(this.props.token,this.props.otherUsersInfo[`info_user_${this.state.selectedContactId}`].relation_id,this.state.selectedContactId)
        }
      }
      

      if(this.state.selectedGroupId){
        // If a group is selected it will be made active. This is used to know if a group is selected and the user is active on the tab in order  to not increase the nr. of unread msgs for that gr if a msg is received. For groups there is no backend attribute to keep track if a user is active on a group so it has to be done from the front end
        // For more info check store->actions->info and store->actions->pusher
        this.props.onMakeGroupActive(this.state.selectedGroupId);

        // If a group is selected and there are unread messages on that group, the unread_messages attr is set to 0 both on the front_end and back_end
        // For more info check store->actions->messages
        if(this.props.groupsInfo[`info_group_${this.state.selectedGroupId}`].unread_messages > 0){
          this.props.onResetUnreadMessagesGroup(this.props.token,this.state.selectedGroupId);
        }
      }
    }else{
      // This part handles a visibility change from visible to hidden of the tab in which the app runs.

      if(this.state.selectedGroupId){
        // Marks the group as inactive in order to increase the nr. of unread msgs for that group if a msg is received
        // // For more info check store->actions->info and store->actions->pusher
        this.props.onMakeGroupInactive();
      }

      // This shows the user as offline to his contacts assuming that both friendships have accepted status
      // For more info check store->actions->info
      this.props.onShowOffline(this.props.token,true);
    }
  }


  //Method used in cojuction with an event listener added when the component mounts in order to keep track of the width of the viewport
  updateWidthOnResize =() => {
    this.setState({width:window.innerWidth})
  }

  changeSearchedValueInfo = (event) => {
    this.setState({searchedValueInfo:event.target.value});
  }

  changeSearchedValueContactAdd = (event) => {
    this.setState({searchedValueContactAdd:event.target.value});
  }

  resetSearchedValueContactAdd = () => {
    this.setState({searchedValueContactAdd:''});
  }

  // When clicking Contacts,Groups or Notifications tab in the InfoMain comp this method is triggered, changing the state to reflect it and showing the corresponding info. 
  changeActiveInfo = (name) => {
    let newActiveInfo = {};
    for(let el in this.state.activeInfo){
      newActiveInfo[el] = name === el ? true : false;
    }

    this.setState({searchedValueInfo:'',activeInfo:newActiveInfo,dropDown:{id:0,show:false}});
  }

  // When clicking a notification(IndividualMiniInfo comp), this function is triggered. First it checks if its status is read, if not it changes it to read and then it extends the notification showing the entire message.
  handleClickMiniNotification = (id,status) => {
    if(this.props.notificationsInfo[`info_notification_${id}`].status !== status){
      this.props.onChangeNotificationStatus(id,status,this.props.token);
    }
    
    this.props.onChangeNotificationExtension(id);
  }

  // When receiving a friendship request notification this is the method that handles it
  // For more info check store->actions->info
  handleFriendshipRequest = (event,friendshipId,friendshipStatus,notificationId) => {
    event.stopPropagation();

    this.props.onHandleFriendshipRequest(friendshipId,friendshipStatus,notificationId,this.props.token);
  }

  // When clicking an IndividualMiniInfo comp in the InfoMain comp, this function is triggered assuming that a contact is clicked
  handleClickMiniContact = (id) => {
    // Messages part/column is set as active(visible) on Main and MessagesMain is set as active(visible) in the Messages part/column. This is done for the eventuality the viewport width is to small and can't accomodate all components
    this.changeActiveOnMain('messages');
    this.changeActiveMessages('main');

    // The selectedContactId is given a value and selectedGroupId is set to 0 
    this.setState({
      selectedContactId:id,
      selectedGroupId:0
    });
  }

  // When clicking an IndividualMiniInfo comp in the InfoMain comp, this function is triggered assuming that a group is clicked
  handleClickMiniGroup = (id) => {
    // Messages part/column is set as active(visible) on Main and MessagesMain is set as active(visible) in the Messages part/column. This is done for the eventuality the viewport width is to small and can't accomodate all components
    this.changeActiveOnMain('messages');
    this.changeActiveMessages('main');

    // The selectedGroupId is given a value and selectedContactId is set to 0 
    this.setState({
      selectedGroupId:id,
      selectedContactId:0,
    })
  }

  // This method is used to keep track of which dropdown(for actions) is active for which IndividualMiniComp. 
  // It is necessary because for each tab(Contacts,Groups and Notifications) only one dropDown can be active, if you try to open another one the previous will close. 
  handleClickDropdownMiniInfo = (id) => {
    this.setState(prevState => {
      return {
        dropDown:{
          id:id,
          show: prevState.dropDown.id === id ? !prevState.dropDown.show : id === 0 ? false : true
        }
      }
    })
  }

  // Method that toggles the visibility of the addition menu
  handleDropDownAddition = () =>  {
    this.setState(prevState => {
      return {
        dropDownAddition: !prevState.dropDownAddition
      }
    })
  }

  // Method that is used to decide what component is visible on the info column/part 
  changeActiveInfoColumn = (name) => {
    let newActiveInfoColumn = {};

    for(let el in this.state.activeInfoColumn){
      newActiveInfoColumn[el] = name === el ? true : false;
    }

    this.setState({activeInfoColumn:newActiveInfoColumn});
  }

  // Method that is used to decide what column/part is visible on the Main(component), Info or Messages. This is usefull when the width of the viewport can't accomodate both.
  changeActiveOnMain = (name) => {
    let newActiveOnMain = {};

    for(let el in this.state.activeOnMain){
      newActiveOnMain[el] = name === el ? true : false;
    }

    this.setState({activeOnMain:newActiveOnMain});
  }

  // Method that is used to decide which component is visible in the Messages column/part . This is usefull when the width of the viewport can't accomodate both.
  changeActiveMessages = (name) => {
    let newActiveMessages = {};

    for(let el in this.state.activeMessages){
      newActiveMessages[el] = name === el ? true : false; 
    }

    this.setState({activeMessages:newActiveMessages});
  }

  // Method used to change the friendship status of a contact
  handleChangeFriendshipStatus = (friendshipId,userId,status,token) => {
    // If a contact is removed then and that contact is the one that is removed then selectedContactId is set to 0 and  the active on Messages part/colum becomes main. Because of this changes the FirstShow comp will be visible in the Message part/column, if it weren't so the one of the components of the Messages column would still visible but it wouldn't have the required info(as it will be removed) to render and an error will be thrown
    // Also the active of Main is set to info this is done in the eventuality the vp width isn't wide enough to accomodate multiple components.
    // For more info check the rendering part below. 
    if(status === 'removed' && this.state.selectedContactId === userId){
      this.setState({selectedContactId:0,selectedGroupId:0});
      this.changeActiveOnMain('info');
      this.changeActiveMessages('main');
    }

    // Function that makes the change in the front end and back end.
    // For more info check store->actions->info
    this.props.onChangeFriendshipStatus(friendshipId,userId,status,token);
  }

  // Method that is triggered when leaving a group
  handleLeaveGroup = (token,mainUserId,groupId) => {
    // Same logic as in handleChangeFriendshipStatus if the status is removed
    if(this.state.selectedGroupId === groupId){
      this.setState({selectedContactId:0,selectedGroupId:0});
      this.changeActiveMessages('main');
      this.changeActiveOnMain('info');
    }
    
    // Function that removes the group info and messages in the front end and severs the link between the user the and group in the back end
    this.props.onLeaveGroup(token,mainUserId,groupId);
  }

  // Method that is triggered when a group was deleted by another member of that group. Same logic as with handleLeaveGroup, the front end is the same, the only difference is in the back end where the group with all its messages and links to users is removed from the database
  handleGroupWasDeleted = (groupId) => {
    if(this.state.selectedGroupId === groupId){
      this.setState({selectedContactId:0,selectedGroupId:0});
      this.changeActiveMessages('main');
      this.changeActiveOnMain('info');
    }

    this.props.onGroupWasDeleted(groupId);
  }

  // Method that is triggered when the user deleted the groups. Same logic as handleGroupWasDeleted. The reason why 2 methods were added to delete a group is because access to Main state was needed and it was difficult to obtain it from from store->actions->pusher, for when a member deleted a group, so I created an is_deleted attr for each group in redux store and when it changes the handleGroupWasDeleted will be triggered in ComponentDidUpdate
  handleDeleteGroup = (token,groupId) => {
    if(this.state.selectedGroupId === groupId){
      this.setState({selectedContactId:0,selectedGroupId:0});
      this.changeActiveMessages('main');
      this.changeActiveOnMain('info');
    }

    this.props.onDeleteGroup(token,groupId);
  }

  // Method used to close and dropdowns when clicking Escape
  onKeyDown = (e) => {
    if(e.key === "Escape"){
      this.handleClickDropdownMiniInfo(0);
      if(this.state.dropDownAddition){
        this.handleDropDownAddition();
      }
    }
  }

  render(){
    return (
      <Container  
        className={[classes.Main,'border-0'].join(' ')} 
        onClick={() => {
          this.handleClickDropdownMiniInfo(0);
          if(this.state.dropDownAddition){
            this.handleDropDownAddition();
          }
        }}
        onKeyDown={this.onKeyDown}
        tabIndex="0"
      >
        <Row className="flex-nowrap border-0">
          {/* This is the css transition used for the Info column, if the vp width is greated than 768px then it will be always visible, if not then it will be visible only if the info is active on Main */}
          <CSSTransition
            in={this.state.activeOnMain.info || this.state.width >= 768}
            timeout={animationTimingPrimary}
            classNames={{
              exitActive:classes.CloseSecondary
            }}
            mountOnEnter
            unmountOnExit
          >
            {/* This is Info column , the left column of the Main comp */}
            <Col 
              xs={12} sm={12} md={5} lg={4} 
              className={["px-0",classes.InfoColumn,this.state.width < 768 ? classes.MakeAbsolute : ''].join(' ')}
            >
              {/* Below are all the Info components and their css transitions : InfoMain,InfoUser,CreateGroup and AddContact*/}
              <CSSTransition 
                mountOnEnter
                unmountOnExit
                in={this.state.activeInfoColumn.infoMain}
                timeout={animationTimingPrimary}
                onExit={()=> {
                  let myActive = '';
                  for(let el in this.state.activeInfo){
                    if(this.state.activeInfo[el]){
                      myActive = el;
                    }
                  }
                  // Used to reset searchValue and close dropdown IndividualMiniInfo if active
                  this.changeActiveInfo(myActive);

                  // Used to close dropDown addition if open
                  if(this.state.dropDownAddition){
                    this.handleDropDownAddition();
                  }
                }}
              >
                <InfoMain 
                  mainUser={this.props.mainUserInfo} 
                  otherUsers={this.props.otherUsersInfo}
                  groups={this.props.groupsInfo}
                  notifications={this.props.notificationsInfo}
                  searchedValue={this.state.searchedValueInfo}
                  activeInfo={this.state.activeInfo}
                  selectedContactId={this.state.selectedContactId}
                  selectedGroupId={this.state.selectedGroupId}
                  dropDown={this.state.dropDown}
                  dropDownAddition={this.state.dropDownAddition}
                  token={this.props.token}
                  changeSearchedValue={this.changeSearchedValueInfo}
                  changeActiveInfo={this.changeActiveInfo}
                  changeActiveInfoColumn={this.changeActiveInfoColumn}
                  clickNotification={this.handleClickMiniNotification}
                  clickContact={this.handleClickMiniContact}
                  clickGroup={this.handleClickMiniGroup}
                  handleFriendshipRequest={this.handleFriendshipRequest}
                  clickDropdownMini = {this.handleClickDropdownMiniInfo}
                  handleDropDownAddition = {this.handleDropDownAddition}
                  changeFriendshipStatus = {this.handleChangeFriendshipStatus}
                  leaveGroup = {this.handleLeaveGroup}
                  deleteGroup = {this.handleDeleteGroup}
                  changeNotificationStatus = {this.props.onChangeNotificationStatus}
                  logout = {this.props.onLogout.bind(this,this.props.token)}
                />
              </CSSTransition>

              <CSSTransition
                in={this.state.activeInfoColumn.infoUser}
                timeout={animationTimingSecondary}
                classNames={{
                  enterActive:classes.OpenSecondary,
                  exitActive:classes.CloseSecondary
                }}
                mountOnEnter
                unmountOnExit
              >
                <InfoUser 
                  changeActiveInfoColumn={this.changeActiveInfoColumn}
                />
              </CSSTransition>

              <CSSTransition
                in={this.state.activeInfoColumn.createGroup}
                timeout={animationTimingSecondary}
                classNames={{
                  enterActive:classes.OpenSecondary,
                  exitActive:classes.CloseSecondary
                }}
                mountOnEnter
                unmountOnExit
              >
                <CreateGroup 
                  changeActiveInfoColumn={this.changeActiveInfoColumn}
                  changeActiveInfo={this.changeActiveInfo}
                />
              </CSSTransition>

              <CSSTransition
                in={this.state.activeInfoColumn.addContact}
                timeout={animationTimingSecondary}
                classNames={{
                  enterActive:classes.OpenSecondary,
                  exitActive:classes.CloseSecondary
                }}
                mountOnEnter
                unmountOnExit
                onExit={()=> {
                  this.props.onClearContactsForAdd();
                  this.resetSearchedValueContactAdd();
                }}
              >
                <AddContact 
                  searchedValue={this.state.searchedValueContactAdd}
                  contactsForAdd={this.props.contactsForAdd}
                  changeSearchedValue={this.changeSearchedValueContactAdd}
                  changeActiveInfoColumn={this.changeActiveInfoColumn}
                  getContactsForAdd={this.props.onGetContactsForAdd.bind(this,this.state.searchedValueContactAdd,this.props.token)}
                  clearContacts={this.props.onClearContactsForAdd}
                  sendFriendshipRequest={this.props.onSendFriendshipRequest.bind(this,this.props.token,this.resetSearchedValueContactAdd,this.changeActiveInfoColumn)}
                />
              </CSSTransition>
            </Col>
          </CSSTransition>

          {/* This is the css transition used for the Messages column, if the vp width is greated than 768px then it will be always visible, if not then it will be visible only if the messages is active on Main */}
          <CSSTransition
            in={this.state.activeOnMain.messages || this.state.width >=768}
            timeout={animationTimingPrimary}
            classNames={{
              exitActive:classes.CloseSecondary
            }}
            mountOnEnter
            unmountOnExit
          >
            {/* This is the Messages column that contains the following components and their transitions: MessagesMain, MessagesInfoGroup and MessagesInfoContact. Maximum of 2 out of the 3 can be visible at any time, MessagesMain being one of them */}
            <Col 
              xs={12} sm={12} md={7} lg={8}  
              className={["px-0",classes.InfoColumn,classes.MessagesInfo,this.state.width < 768 ? classes.MakeAbsolute : ''].join(' ')}
            >
              <Row className="flex-nowrap mx-0">
                {/* This is the css transition for the column that contains either MessagesMain or FirstShow. If the vp width is greater than 992 than it will always be visible, if not then it will visible only if main is active on Messages*/}
                <CSSTransition
                  in={this.state.activeMessages.main || this.state.width >=992}
                  timeout={animationTimingPrimary}
                  mountOnEnter
                  unmountOnExit
                  // classNames={{
                  //   enterActive:classes.OpenSecondary,
                  //   exitActive:classes.CloseSecondary
                  // }}
                > 
                  {/* This is the column that holds either FirstShow or MessagesMain comp. MessagesMain is rendered only if a group or contact is selected and FirstShow is rendered when it's not. This happens when the app first starts and when the selected group/contact is removed */}
                  <Col 
                    xs={12} 
                    lg={this.state.activeMessages.info ?6 : 12} 
                    xl={this.state.activeMessages.info ?7 : 12} 
                    className={["bg-warning","px-0",classes.InfoColumn].join(' ')}
                  >
                      {this.state.selectedContactId ||  this.state.selectedGroupId ? (
                        <MessagesMain 
                        type={this.state.selectedContactId ? 'contact' : 'group'}
                        selectedId={this.state.selectedContactId ? this.state.selectedContactId :  this.state.selectedGroupId}
                        info={this.state.selectedContactId ? this.props.otherUsersInfo[`info_user_${this.state.selectedContactId}`] : this.props.groupsInfo[`info_group_${this.state.selectedGroupId}`]}
                        width={this.state.width}
                        showBackArrow={this.state.activeOnMain.messages && this.state.activeMessages.main && this.state.width < 768}
                        activeMessagesInfo={this.state.activeMessages.info}
                        goBack={this.changeActiveOnMain.bind(this,'info')}
                        showMessagesInfo={this.changeActiveMessages.bind(this,'info')}
                        />
                      ) : (<FirstShow />)}
                  </Col>
                </CSSTransition>

                {/* This is the css transition for the column that holds  MessagesInfoContact and MessagesInfoGroup, it will only be show if info is active on Messages. Different classes are used when the vp width is over or under 768px because at this width, only one component is shown. Only the direction of the transition is different, left or right*/}
                <CSSTransition
                  in={this.state.activeMessages.info}
                  timeout={animationTimingSecondary}
                  classNames={{
                    enterActive:this.state.width < 768 ? classes.OpenSecondary: classes.OpenMessagesInfo,
                    exitActive:this.state.width < 768 ? classes.CloseSecondary : classes.CloseMessagesInfo
                  }}
                  mountOnEnter
                  unmountOnExit
                >
                  {/* MessagesInfoContact is rendered when a contact is selected and  MessagesInfoGroup is rendered when a group is selected*/}
                  <Col 
                    xs={12} lg={6} xl={5} 
                    className={["px-0",classes.InfoColumn,this.state.width < 992 ? classes.MakeAbsolute : classes.MakeAbsolute2].join(' ')}
                  >
                    {this.state.selectedContactId ? (
                      <MessagesInfoContact
                        backToMain = {this.changeActiveMessages.bind(this,'main')}
                        info={this.props.otherUsersInfo[`info_user_${this.state.selectedContactId}`]}
                        selectedId={this.state.selectedContactId}
                        changeFriendshipStatus={this.handleChangeFriendshipStatus}
                      />
                    ) : null}

                    {this.state.selectedGroupId ? (
                      <MessagesInfoGroup
                        backToMain = {this.changeActiveMessages.bind(this,'main')}
                        info={this.props.groupsInfo[`info_group_${this.state.selectedGroupId}`]}
                        contacts={this.props.otherUsersInfo}
                        selectedId={this.state.selectedGroupId}
                        leaveGroup={this.handleLeaveGroup}
                        deleteGroup = {this.handleDeleteGroup}
                      />
                    ):null}

                  </Col>  
                </CSSTransition>
              </Row>
            </Col>
          </CSSTransition>
        </Row>
      </Container>
    )
  }
}

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    mainUserInfo: state.info.mainUser,
    otherUsersInfo: state.info.otherUsers,
    groupsInfo: state.info.groups,
    notificationsInfo: state.info.notifications,
    contactsForAdd: state.info.contactsForAdd
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
const mapDispatchToProps = dispatch => {
  return {
    onAddMainUserInfo: (userId,token) => dispatch(actions.getMainUserInfo(userId,token)),

    onChangeNotificationStatus: (id,status,token) => dispatch(actions.changeNotificationStatus(id,status,token)),

    onChangeNotificationExtension: (id) => dispatch(actions.changeNotificationExtension(id)),

    onHandleFriendshipRequest:(friendshipId,friendshipStatus,notificationId,token) => dispatch(actions.handleFriendshipRequest(friendshipId,friendshipStatus,notificationId,token)),

    onChangeFriendshipStatus: (friendshipId,userId,status,token) => dispatch(actions.changeFriendshipStatus(friendshipId,userId,status,token)),

    onLeaveGroup: (token,mainUserId,groupId) => dispatch(actions.leaveGroup(token,mainUserId,groupId)),

    onGroupWasDeleted: (groupId) => dispatch(actions.groupWasDeleted(groupId)),

    onDeleteGroup: (token,groupId) => dispatch(actions.deleteGroup(token,groupId)),

    onGetContactsForAdd: (username,token) => dispatch(actions.getContactsForAdd(username,token)),

    onClearContactsForAdd: () => dispatch(actions.clearContactsForAdd()),

    onSendFriendshipRequest: (token,resetSearchedValue,changeActiveInfoColumn,friendId) => dispatch(actions.sendFriendshipRequest(token,resetSearchedValue,changeActiveInfoColumn,friendId)),

    onShowOnline: (token) => dispatch(actions.showOnline(token)),

    onShowOffline: (token,async) => dispatch(actions.showOffline(token,async)),

    onShowActive: (token,userId) => dispatch(actions.showActive(token,userId)),

    onMakeGroupActive: (groupId) => dispatch(actions.makeGroupActive(groupId)),

    onMakeGroupInactive: () => dispatch(actions.makeGroupInactive()),

    onLogout: (token) => dispatch(actions.logoutFromApp(token)),

    onResetUnreadMessagesContact: (token,friendshipId,userId) => dispatch(actions.resetUnreadMessagesContact(token,friendshipId,userId)),

    onResetUnreadMessagesGroup: (token,groupId) => dispatch(actions.resetUnreadMessagesGroup(token,groupId))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Main);