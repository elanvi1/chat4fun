import React from 'react';

import classes from './Message.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const message = (props) => {
  const sentByMainUser = props.mainUserId === props.message.sender_id;
  const messageColor = sentByMainUser ? 'rgb(172, 212, 172)' : 'rgb(210, 212, 210)';
  let maxWidth = '70%';
  let checkmark = null;
  let nameElement = null;
  let hasDeleteMsgPermission = props.type === 'group' ?  props.permission === "Admin" || props.permission === "Edit" : false

  if(props.activeMessagesInfo || (props.width >= 768 && props.width < 991) || props.width < 600){
    maxWidth = '94%';
  }

  // A different checkmark is used depending on the status of the message
  if(sentByMainUser){
    if(props.message.status === 'sending'){
      checkmark = <Spinner />;
    }else if(props.message.status === 'sent'){
      checkmark = <i className="fas fa-check fa-1x ml-1 align-self-center"></i>;
    }else if(props.message.status === 'read'){
      checkmark = <i className="fas fa-check-double fa-1x ml-1 align-self-center"></i>
    }else if(props.message.status === 'failed'){
      checkmark = <i className="fas fa-exclamation-triangle fa-1x ml-1 align-self-center"></i>
    }
  }

  // In a group, if a message is not sent by the user but by another member, the username or alias of that member is shown above the msg
  if(props.type === 'group' && !sentByMainUser){
    nameElement = <strong>{props.message.sender_name}</strong>
  }

  // There is an x icon that appears in the top right corner of a msg if you hover it, which deletes the msg. In a contact convo it appears only for the messages sent by the user. In a group convo in addition to these, it can appear over the messages of other members if the permission allows it. 
  let removeElement = (sentByMainUser || hasDeleteMsgPermission) && props.message.status !== 'sending' && props.message.status !== 'failed'? (
    <OverlayTrigger
      placement="top"
      delay={{show:550, hide:0}}
      overlay={
        <Tooltip id={`tooltip_show_status}`}>
          Delete Message
        </Tooltip>
      }
    >
      <div 
        style = {{background: sentByMainUser ?'linear-gradient(to right,rgba(172, 212, 172,0.6) 0.45rem,rgba(172, 212, 172,1) 0.45rem)' : 'linear-gradient(to right,rgba(210, 212, 210,0) 0.45rem,rgba(210, 212, 210,1) 0.45rem)'}}
        className={classes.Remove}
      >
        {/* For more info check store->actions->messages */}
        <i 
          className="far fa-times-circle fa-1x text-danger text-center"
          onClick={props.deleteMsg.bind(this,props.selectedId,props.type,props.message.id,props.isLastMsg,props.nextMessage)}
        ></i>
      </div>
    </OverlayTrigger>
  ) : null;

  // If a messages fails to deliver a text is shown below the message to inform the user of this fact.
  let failedMessageElement = sentByMainUser && props.message.status === "failed" ? (
    <span className={['text-light',classes.FailedMsgInfo].join(' ')}>Message was not received by {props.type}, nor was it saved on the server, due to an error</span>
  ):null;

  // Creating anchor elements for links
  let actualMessage = props.message.message;
  let exp = /((((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;;
  let hasLink = actualMessage.search(exp);

  if(hasLink !== -1){
    let messageArray = actualMessage.split(exp);
    actualMessage = messageArray.map(part => {
      if(exp.test(part)){
        return <a href={part} target="_blank" rel="noreferrer" key={part}>{part}</a>
      }
      if(part === "http://" || part === "https://" || part === "https" || part === "http" || part==="www."){
        return null;
      }
      return part;
    });
  }
  
  return (
    <div 
      style={{
        background: messageColor,
        maxWidth:maxWidth,
        boxShadow: sentByMainUser ? '0px 0px 10px 2px rgb(172, 212, 172)' : '0px 0px 10px 2px rgb(210, 212, 210)'
      }}
      className={[
        'pt-1 pb-3 pl-2 pr-2',classes.Message,
        sentByMainUser?'ml-auto':'mr-auto',
        props.showBubble && props.message.status !== 'failed'? sentByMainUser ? classes.BubbleRight : classes.BubbleLeft :'',
        props.message.status === 'failed' ? 'bg-danger' :''
      ].join(' ')}
    >
      {nameElement}

      <span>{actualMessage}</span>
      {failedMessageElement}

      <div className={[props.message.status === 'failed' ? 'text-light' :"text-muted",classes.MessageInfo].join(' ')}>
        {props.timeOfDay}{checkmark}
      </div>

      {removeElement}
    </div>
  );
};

export default message;