import React, { Component } from "react";
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';
import moment from 'moment';

import classes from './MessagesMain.module.css';
import Row  from "react-bootstrap/Row";
import Image  from "react-bootstrap/Image";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger  from "react-bootstrap/OverlayTrigger";
import noAvatarImg from "../../../assets/no-avatar.jpg";
import noAvatarGroupImg from '../../../assets/no-avatar-group.png';
import Spinner from '../../../components/UI/Spinner/Spinner';
import DateMessage from '../../../components/Messages/DateMessage/DateMessage';
import Message from '../../../components/Messages/Message/Message';
import NotificationMessage from '../../../components/Messages/NotificationMessage/NotificationMessage';
import * as actions from '../../../store/actions/index';

const animationTimingStatus = {
  enter: 100,
  exit: 100
};

// MessagesMain is used view the messages from a certain covo and send messages in that convo. In case with a convo with a contact it is also used to view the status of the friendships between the 2. It contains the following:
// - Header which in turn has:
//  - an image
//  - the username or alias in case of a contact covo. For group convo the group name is shown
//  - the presence of the contact(offline, online or active on chat) for contact convo and for group convo it shows the permission.
//  - A status icon only for contact convo that toggles the visibility of the elements that contain info about friendships status.
//  - A info icon that renders the MessagesInfoContact or MessagesInfoGroup comp.
// - The body which contains the messages(and notifications in case of group covno)
// - A footer that contains a field where the user can enter his message

class MessagesMain extends Component{
  state ={
    showStatus:false,
    messageValue: '',
    tempMsgId: 1
  }

  // Using constructor in order to create 2 refferences to 2 html elements.
  constructor(props) {
    super(props);
    this.messageBox = React.createRef();
    this.msgText = React.createRef();
  }

  componentDidMount(){
    if(this.props.type === 'contact'){
      // Show active to that contact 
      // Check handleVisibilityChange in Main comp for more info
      this.props.onShowActive(this.props.token,this.props.selectedId);
      
      // Reset unread messages if any
      // Check handleVisibilityChange in Main comp for more info
      if(this.props.info.unread_messages > 0){
        this.props.onResetUnreadMessagesContact(this.props.token,this.props.info.relation_id,this.props.selectedId);
      }
    }

    if(this.props.type === 'group' ){
      // Mark the group as active in order to manage unread messages. 
      // Check handleVisibilityChange in Main comp for more info
      this.props.onMakeGroupActive(this.props.selectedId);

      // Reset unread messages for a group if any
      if(this.props.info.unread_messages > 0){
        this.props.onResetUnreadMessagesGroup(this.props.token,this.props.selectedId);
      }
    }

    let hasMessages = this.props.type === "contact" ? this.props.convosContacts[`convo_with_user_${this.props.selectedId}`].info.got_messages : this.props.convosGroups[`convo_group_${this.props.selectedId}`].info.got_messages;

    // Method used to get the messages from the server. First checks if there is a last message and if the messages were already retreived before
    // For more info check out store->actions->messages
    if(this.props.info.last_message && !hasMessages){
      this.props.onGetMessagesConvo(this.props.selectedId,this.props.type,this.props.token,1,false);
    }
   
    // Scrolls to the bottom of each conversation
    this.messageBox.current.scrollTo(0,this.messageBox.scrollHeight);
    // Event handler for scroll to get new messages if any
    this.messageBox.current.addEventListener('scroll',this.addNewMessages);
    // Event handler for the textarea elem in which the message is entered added in order to extend the text area to a certain point
    this.msgText.current.oninput = this.adjustMsgText;
  }

  componentDidUpdate(prevProps,prevState){
    let hasMessages = true;

    if(prevProps.selectedId !== this.props.selectedId || prevProps.type !== this.props.type){
      // Show inactive to the previous contact 
      // Check handleVisibilityChange in Main comp for more info
      if(prevProps.type === 'contact'){
        this.props.onShowInactive(this.props.token,prevProps.selectedId);
      }
      
      if(this.props.type === 'contact'){
        // Show active to that contact 
        // Check handleVisibilityChange in Main comp for more info
        this.props.onShowActive(this.props.token,this.props.selectedId);

        // Reset unread messages if any
        // Check handleVisibilityChange in Main comp for more info
        if(this.props.info.unread_messages > 0){
          this.props.onResetUnreadMessagesContact(this.props.token,this.props.info.relation_id,this.props.selectedId);
        }

        hasMessages = this.props.convosContacts[`convo_with_user_${this.props.selectedId}`].info.got_messages;
      }

      if(this.props.type === 'group'){
        // Mark the group as active in order to manage unread messages. 
        // Check handleVisibilityChange in Main comp for more info
        this.props.onMakeGroupActive(this.props.selectedId);

        // Reset unread messages for a group if any
        if(this.props.info.unread_messages > 0){
          this.props.onResetUnreadMessagesGroup(this.props.token,this.props.selectedId);
        }

        hasMessages = this.props.convosGroups[`convo_group_${this.props.selectedId}`].info.got_messages;
      }

      // Method used to get the messages from the server. First checks if there is a last message and if the messages were already retreived before
      // For more info check out store->actions->messages   
      if(!hasMessages && this.props.info.last_message){
        this.props.onGetMessagesConvo(this.props.selectedId,this.props.type,this.props.token,1,false);
      }

      // "Resets" done when changing selection.
      this.messageBox.current.scrollTo(0,this.messageBox.current.scrollHeight);
      this.resetMsgText();
      this.msgText.current.style.height = "";
    }

    // Mark the group as inactive in order to manage unread messages. 
    // Check handleVisibilityChange in Main comp for more info
    if(this.props.type === 'contact' && prevProps.type === 'group'){
      this.props.onMakeGroupInactive();
    }
  }

  componentWillUnmount(){
    // Show inactive when the component unmounts, this is useful for smaller screens when all three components can't be visibile at the same time.
    if(this.props.type === 'contact'){
      this.props.onShowInactive(this.props.token,this.props.selectedId);
    }

    // Mark the group as inactive in order to manage unread messages. 
    // Check handleVisibilityChange in Main comp for more info
    if(this.props.type === 'group'){
      this.props.onMakeGroupInactive();
    }

    // Removing event listeners
    this.messageBox.current.removeEventListener('scroll',this.addNewMessages);
    this.msgText.current.oninput = null;
  }

  // Method used to add new messages when scrolling to the top of a convo
  addNewMessages = () => {
    let isAtTop = -this.messageBox.current.scrollTop + this.messageBox.current.clientHeight > (this.messageBox.current.scrollHeight - 20);
    let nextPage = this.props.type === 'contact' ? this.props.convosContacts[`convo_with_user_${this.props.selectedId}`].info.next_page : this.props.convosGroups[`convo_group_${this.props.selectedId}`].info.next_page;
    let hasAdditionalMsgs = this.props.info.last_message ? nextPage : false;

    // Checking if the convo is at the top, there isn't already a load for retrieving the additional messages in place and if there are any additional messages.
    // For more info check store->actions->messages
    if(isAtTop && !this.props.loadingAdditional && hasAdditionalMsgs){
      this.props.onGetMessagesConvo(this.props.selectedId,this.props.type,this.props.token,nextPage,true);
    }
  }

  // Method used when a user writes his message so that the box extends to fit the message to a maximum of 200 pixels.
  adjustMsgText = () => {
    this.msgText.current.style.height = "";
    this.msgText.current.style.height = Math.min(this.msgText.current.scrollHeight,200) + 'px';
  }

  // Toggles the visibility of the elements that contain info about friendship status.
  toggleShowStatus = () => {
    this.setState(prevState=>{
      return {
        showStatus:!prevState.showStatus
      }
    })
  }

  changeMessageValue = (event) => {
    this.setState({messageValue:event.target.value});
  }

  sendMessage = () => {
    // Creating a temporary message to show with sending status while the request is processed in the back end.
    let tempMessage = {
      id:this.state.tempMsgId,
      sender_id:this.props.mainUserId,
      receiver_id:this.props.selectedId,
      receiver_type: this.props.type === 'contact' ? 'user' : 'group',
      message:this.state.messageValue.trim(),
      status:'sending',
      created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    // Resetting state and increasing the tempMsgId which is used to differentiate between temp messages
    this.setState(prevState => {
      return {
        messageValue:'',
        tempMsgId: prevState.tempMsgId+1
      }
    })

    this.msgText.current.style.height = "";

    // For more info check store->actions->messages
    this.props.onSendMessage(this.props.type,this.props.selectedId,tempMessage,this.props.token);
  }

  resetMsgText = () => {
    this.setState({messageValue:''});
  }

  render(){
    let imagePath = this.props.info.image ? this.props.info.image : this.props.type === 'contact' ? noAvatarImg : noAvatarGroupImg;

    let header = (
      <Row className={['py-3 align-items-center flex-nowrap mx-0',classes.HeaderMessagesMain].join(' ')}>
        {this.props.showBackArrow ? (
          <i 
          className={["fas fa-arrow-left mx-2",classes.BackArrow].join(' ')}
          onClick={this.props.goBack}
          ></i>
        ): null}

        <Image src={imagePath} roundedCircle height={40} width={40} className='mx-3'/>

        <div className={['d-flex flex-nowrap p-0 my-0 mx-2 flex-column'].join(' ')}>
          <strong className={['text-dark',classes.Name].join(' ')}>{
            this.props.type === 'contact' ? this.props.info.alias ? this.props.info.alias : this.props.info.username : this.props.info.name
          }</strong>

          <p className={['m-0 p-0 text-light fs-1',classes.UnderText].join(' ')}>{
            this.props.type === 'contact' ?  this.props.info.is_active ? 'Active'  : this.props.info.is_online ? 'Online' : 'Offline' : `${this.props.info.permission} Permission`
          }</p>
        </div>

        {this.props.type === 'contact' ? (
          <OverlayTrigger
            placement="bottom"
            delay={{show:850, hide:0}}
            overlay={
              <Tooltip id={`tooltip_show_status}`}>
                Status
              </Tooltip>
            }
          >
            <i 
              className={["fas fa-lightbulb ml-auto mx-3 fa-2x text-info",classes.Pointer].join(' ')}
              aria-expanded={this.state.showStatus}
              onClick={this.toggleShowStatus}
            ></i>
          </OverlayTrigger>
        ):null}

        <OverlayTrigger
          placement="bottom"
          delay={{show:850, hide:0}}
          overlay={
            <Tooltip id={`tooltip_show_status}`}>
              {this.props.type === 'contact' ?'Contact Info' : 'Group Info'}
            </Tooltip>
          }
        >
          <i 
          className={["fas fa-info-circle mx-3 fa-2x",classes.Pointer,this.props.type === "group" ? 'ml-auto': ''].join(' ')}
          onClick={this.props.showMessagesInfo}
        ></i>
        </OverlayTrigger>
      </Row>
    )

    // Creating a messages array with info about messages taken from redux, in order to create DateMessage and Message comps.
    let messagesArray = [];
    let messagesObject = null;

    if(this.props.type === 'contact'){
      messagesObject = this.props.convosContacts[`convo_with_user_${this.props.selectedId}`].messages;
    }else{
      messagesObject = this.props.convosGroups[`convo_group_${this.props.selectedId}`].messages;
    }


    if(messagesObject){
      for(let el in messagesObject){
        messagesArray.push({...messagesObject[el],msgId: el})
      }
    }

    // Sorting in such a way that the last message appears at the bottom
    messagesArray = messagesArray.sort((el1,el2)=>{
      if(el2){
        let date1 = moment(el1.created_at);
        let date2 = moment(el2.created_at);
       
        return -date1.diff(date2,'seconds');
      }else{
        return 0;
      }
    })

    let lastMsgFound = false;
    let messages = messagesArray.map((item,i,myArray) => {
      let date = moment(item.created_at);
      let nextDate = null;
      let dateToShow = '';
      let dateElement = null;
      let showBubble = false;
      let timeOfDay = '';
      // The configuration of how the date should look
      let dateConfig = {
        sameDay:'[Today]',
        lastDay:'[Yesterday]',
        lastWeek:'dddd',
        sameElse:'DD/MM/YYYY'
      };
      let isMessage = item.msgId.includes('message');
      let isLastMsg = false;
      if(!lastMsgFound && isMessage){
        isLastMsg = true;
        lastMsgFound = true;
      }
      let nextMessage =  null;
      if(isLastMsg && i !== myArray.length - 1){
        for(let j=i+1;j<myArray.length;j++){
          if(myArray[j].msgId.includes('message')){
            nextMessage = myArray[j];
            break;
          }
        }
      }
 
      // The logic of how messages and dates should be positioned relative to each other
      if(i === myArray.length - 1){
        dateToShow = date.calendar(null,dateConfig);

        dateElement = <DateMessage className="mx-auto p-2 bg-dark text-white" >{dateToShow}</DateMessage>;
      }else{
        nextDate = moment(myArray[i+1].created_at);

        if(date.calendar(nextDate,dateConfig) !== 'Today'){
          dateToShow = date.calendar(null,dateConfig);
  
          dateElement = <DateMessage>{dateToShow}</DateMessage>;
        }

        if(item.sender_id !== myArray[i+1].sender_id){
          showBubble = true;
        }
      }

      if(dateToShow ){
        showBubble = true;
      }

      timeOfDay = date.format('HH:mm');

      return (
        <React.Fragment key={item.msgId}>
          {isMessage ?<Message
            mainUserId={this.props.mainUserId}
            message={item}
            selectedId={this.props.selectedId}
            showBubble={showBubble}
            activeMessagesInfo={this.props.activeMessagesInfo}
            width={this.props.width}
            timeOfDay={timeOfDay}
            type={this.props.type}
            isLastMsg={isLastMsg}
            nextMessage={nextMessage}
            permission={this.props.type === 'group' ? this.props.info.permission : null}
            deleteMsg={this.props.onDeleteMessage.bind(this,this.props.token)}
          /> : (
            <NotificationMessage 
              notification={item}
              timeOfDay={timeOfDay}
            />
          )}

          {dateElement}
        </React.Fragment>
      );
    });

    // Showing a spinner while retrieving the messages for the first time
    let spinner = this.props.loading  ? (
      <Spinner size="large" className="my-auto"/>
    ) : this.props.loadingAdditional ? (
      <div className="mx-auto pt-4">
        <Spinner size="medium"/>
      </div>
    ) : null;

    let body = (
      <div className={['d-flex flex-column flex-nowrap',classes.Body].join(' ')}>
        {/* The part that shows the info about each friendship status, of the user with the contact and of the contact with the user*/}
        <CSSTransition
          in={this.state.showStatus && this.props.type==='contact'}
          timeout={animationTimingStatus}
          classNames={{
            enterActive:classes.OpenStatus,
            exitActive:classes.CloseStatus
          }}
          mountOnEnter
          unmountOnExit
        >
          <div className="d-flex flex-column" onClick={this.toggleShowStatus}>
            <Row className={['p-2 align-items-center mx-0 border-bottom',this.props.info.status === 'accepted' ? 'bg-success' : 'bg-danger'].join(' ')}>
              {this.props.info.status === 'accepted' ? <i className="far fa-thumbs-up fa-2x text-white"></i> 
              : this.props.info.status === 'blocked' ? <i className="fas fa-ban fa-2x text-white"></i> 
              : <i className="far fa-times-circle fa-2x text-white"></i>}
            
              <strong className={['mx-2',classes.StatusHeader].join(' ')}>{this.props.info.status}</strong>

              <div className="text-white d-inline">
                {this.props.info.status === 'accepted' ? "The status of your friendship with this contact is accepted. This means that you can see all messages past and future from this contact"
                : this.props.info.status === 'blocked' ? "You have blocked this user.This means that you will not see any messages or notifications that were sent by the contact from the time the block took place. However these can be seen by unblocking the contact. Past messages are still available and you can still send messages to this user which could be seen by them depending on their status" 
                : "This user has deleted his/her account. Past messages are still available and you are still able to send messages to them but they will only be seen if the user decides to reactivate their account"}
              </div>
            </Row>

            {this.props.info.status === 'deleted' ? null :(
              <Row className={['p-2 align-items-center mx-0',this.props.info.other_status === 'accepted' ? 'bg-success' : 'bg-danger'].join(' ')}>
                {this.props.info.other_status === 'accepted' ? <i className="far fa-thumbs-up fa-2x text-white"></i> 
                : this.props.info.other_status === 'blocked' ? <i className="fas fa-ban fa-2x text-white"></i> 
                : <i className="fas fa-user-times fa-2x text-white"></i>}
              
                <strong className={['mx-2',classes.StatusHeader].join(' ')}>{this.props.info.other_status}</strong>

                <div className="text-white d-inline">
                  {this.props.info.other_status === 'accepted' ? "The status of the contacts friendship with you is accepted. This means that they can see all messages from you, past and future"
                  : this.props.info.other_status === 'blocked' ? `You have been blocked by this user.This means that he/she will not be able to see any messages or notifications that were sent by you from the time the block took place. However these can be seen if the contact decides to unblock you.` 
                  : "This user has removed you from their contact list. This means that he/she will not be able to see any messages from you unless they readd you. This can only be done if your friendship status with them is different than block"}
                </div>
              </Row>
            )}
          </div>
        </CSSTransition>
        {/* ---------------------------------------------------- */}

        {/* Here is wher the messages will be placed, along with a  spinner for when additional messages are retrieved*/}
        <div className={[classes.Messages].join(' ')} id="Messages" ref={this.messageBox}>
          {messages}
          {spinner}
        </div>
      </div>
    )


    let footer = (
      <div className={["input-group p-2 input-group-lg",classes.Footer].join(' ')}>
        {/* type="text" */}
        <textarea 
          rows="1"
          aria-label="Message box" aria-describedby="Place you write the message which you want to send"
          className={["form-control",classes.SendMsgInput].join(' ')}  
          onChange={this.changeMessageValue}
          onKeyPress={e => {
            if(e.key === "Enter" && this.state.messageValue.trim() && !e.shiftKey){
              e.preventDefault();
              this.sendMessage();
            }
          }}
          value={this.state.messageValue}
          ref={this.msgText}
        />

        <span 
          className={["input-group-text",classes.SendSign,this.state.messageValue.trim() ? 'text-success' : ''].join(' ')}
          onClick={this.state.messageValue.trim() ? this.sendMessage : null}
        >
          <i className={["fas fa-chevron-right fa-2x align-self-center"].join(' ')}></i>
        </span>
      </div>
    );

    let content =(
      <>
        {header}
        {body}
        {footer}
      </>
    )

    return (
      <div className={classes.MessagesMain} >
        {content}
      </div>
    );
  };
};

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    convosContacts: state.messages.convosContacts,
    convosGroups: state.messages.convosGroups,
    loading:state.messages.loading,
    loadingAdditional: state.messages.loading_additional,
    mainUserId:parseInt(state.auth.userId)
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
const mapDispatchToProps = dispatch => {
  return {
    onShowActive: (token,userId) => dispatch(actions.showActive(token,userId)),

    onShowInactive: (token,userId) => dispatch(actions.showInactive(token,userId)),

    onMakeGroupActive: (groupId) => dispatch(actions.makeGroupActive(groupId)),

    onMakeGroupInactive: () => dispatch(actions.makeGroupInactive()),

    onResetUnreadMessagesContact: (token,friendshipId,userId) => dispatch(actions.resetUnreadMessagesContact(token,friendshipId,userId)),

    onResetUnreadMessagesGroup: (token,groupId) => dispatch(actions.resetUnreadMessagesGroup(token,groupId)),

    onGetMessagesConvo: (id,type,token,page,forAdditional) => dispatch(actions.getMessagesConvo(id,type,token,page,forAdditional)),

    onSendMessage: (type,id,tempMessage,token) => dispatch(actions.sendMessage(type,id,tempMessage,token)),

    onDeleteMessage: (token,id,type,msgId,isLastMsg,nextMsg) => dispatch(actions.deleteMessage(token,id,type,msgId,isLastMsg,nextMsg))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MessagesMain);