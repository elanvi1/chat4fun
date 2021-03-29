import React from 'react';
import moment from 'moment';

import classes from './IndividualMiniInfo.module.css'
import ListGroup  from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import noAvatarImg from "../../../assets/no-avatar.jpg";
import noAvatarGroupImg from '../../../assets/no-avatar-group.png';
import Spinner from "../../UI/Spinner/Spinner";
import Dropdown  from "react-bootstrap/Dropdown";
import Badge  from "react-bootstrap/Badge";

// For groups and contacts each IndividualMiniInfo comp has the following:
// - An image of the contact
// - The username or alias(only if users sets one for the contact) of the contact.
// - A shortened version of the last Message to maximum of 35 characters. If the last message was sent by the user then its status is also show:
//   - one checkmark shows that it was sent
//   - two checkmarks shows that it was read
//   - a spinner shows that the messages is the process of being sent
//   - a red x sign shows that the message has failed and it was not sent
// - The date in top right (see below for more info)
// - A down arrow which toggles the actions menu. The actions are block, unblock and remove for contact and Leave Group and Delete Group(if user has permission) for Groups

// For notification it contains:
// - The title of the notification
// - The Message of the notification which is shortened to 45 chars in minimized form
// - The date in top right(see below for more info)
// - A down arrow which toggles the actions menu. The actions are Mark As Read/Unread and Remove

// A notification can extended/minimized by clicking on it . It is marked as read by clicking on it. 
// If there is friendship request notification than 2 more icons will appear , one to accept and another to reject

const individualMiniInfo = (props) => {
  let date = null;
  let lastMessage = '';
  let name = '';
  let imgPath = '';
  let checkmark = '';
  let checkLength = props.activeInfo.notifications ? props.indInfo.minimized? 45 : 200 : 35;
  let checkNameLength = props.activeInfo.notifications ? 40 :17;
  let friendshipId = 0;

  // ESTABLISHING WHAT THE LAST message is depending on the case
  if(props.indInfo.last_message || props.indInfo.message){
    let fullMessage = '';

    if(props.activeInfo.contacts){
      fullMessage = props.indInfo.last_message.message;
    }else if(props.activeInfo.groups){
      // In a group if the last message was not sent by the user then the username or alias of the group member that sent it will be shown
      fullMessage = `${props.indInfo.last_message.sender_id !== props.mainUserId ? props.indInfo.last_message.sender_name+':' : ''} ${props.indInfo.last_message.message}`;
    }else if(props.activeInfo.notifications){
      if(props.indInfo.title === "Friendship Request Received"){
        // Getting the friendship id along with the notification id in case of a friendship request
        let messageAndFrId = props.indInfo.message.split('friendship_id');
        fullMessage = messageAndFrId[0];
        friendshipId = parseInt(messageAndFrId[1]);
      }else {
        fullMessage = props.indInfo.message;
      }
    }
    
    lastMessage = `${fullMessage.substring(0,checkLength)}${fullMessage.length > checkLength ? '...' : ''}`;

     // Adding checkmarks to the last message in case last message was sent by main user, to identify the status of the message

    if(props.activeInfo.contacts || props.activeInfo.groups){
      if(props.indInfo.last_message.sender_id === props.mainUserId){
        if(props.indInfo.last_message.status === 'sending'){
          checkmark = <Spinner />;
        }else if(props.indInfo.last_message.status === 'sent'){
          checkmark = <i className="fas fa-check fa-1x mr-1"></i>;
        }else if(props.indInfo.last_message.status === 'read'){
          checkmark = <i className="fas fa-check-double fa-1x mr-1"></i>
        }else if(props.indInfo.last_message.status === 'failed'){
          checkmark = <i className="fas fa-exclamation-triangle fa-1x mr-1 text-danger align-self-center"></i>
        }
      }
    }
  }else{
    if(props.activeInfo.contacts){
      lastMessage = 'No messages with this contact';
    }else if(props.activeInfo.groups){
      lastMessage = 'No messages in this group';
    }
  }

  // ESTABLISHING WHAT THE name is depending on the case
  
  if(props.activeInfo.contacts){
    // An alias will be shown(if there is one) instead of the username, for a contact.
    name = props.indInfo.alias ? props.indInfo.alias : props.indInfo.username;
  }else if(props.activeInfo.groups){
    name = props.indInfo.name;
  }else if(props.activeInfo.notifications){
    name = props.indInfo.title;
  }
  
  name = `${name.substring(0,checkNameLength)}${name.length>checkNameLength ? '...':''}`;

  // ESTABLISHING WHAT THE date is , same for all cases

  if(props.indInfo.last_message || props.indInfo.message){
    date = moment(props.indInfo.last_message ? props.indInfo.last_message.created_at : props.indInfo.created_at);
    // Here you can see the format of the date, relative to the current day. 
    let dateConfig = {
      sameDay:'HH:mm',
      lastDay:'[Yesterday]',
      lastWeek:'dddd',
      sameElse:'DD/MM/YYYY'
    };

    date = date.calendar(null,dateConfig);
  }

  // ESTABLISHING WHAT THE image path is , same for all cases
  if(props.activeInfo.contacts || props.activeInfo.groups){
    imgPath = props.indInfo.image ? props.indInfo.image : props.activeInfo.contacts ? noAvatarImg :noAvatarGroupImg;
  }

  // Getting the id depending on active info

  let identifier = 0;

  if(props.activeInfo.contacts){
    identifier = props.indInfo.user_id;
  }else if(props.activeInfo.groups){
    identifier = props.indInfo.group_id;
  }else if(props.activeInfo.notifications){
    identifier = props.indInfo.id;
  }

  let onClickFunction = null;
  let friendshipHandle = null;

  if(props.activeInfo.notifications){
    onClickFunction = props.onClickFunction.bind(this,identifier,'read');

    // Creating elements to accept or reject a friendship request
    if(props.indInfo.minimized === false && props.indInfo.title === "Friendship Request Received"){
      friendshipHandle = (
        <div className="d-flex justify-content-evenly ml-2">
          <i 
            className={["far fa-check-circle fa-3x bg-success rounded-circle text-white mr-1",classes.AcceptOrReject].join(' ')}
            onClick={event=>props.handleFriendshipRequest(event,friendshipId,'accepted',identifier)}
          ></i>
          <i 
            className={["far fa-times-circle fa-3x bg-danger rounded-circle text-white",classes.AcceptOrReject].join(' ')}
            onClick={event=>props.handleFriendshipRequest(event,friendshipId,'rejected',identifier)}
          ></i>
        </div>
      );
    }
  }else if(props.activeInfo.contacts){
    onClickFunction = props.onClickFunction.bind(this,identifier);
  }else if(props.activeInfo.groups){
    onClickFunction = props.onClickFunction.bind(this,identifier);
  }

  // Establishing what the drop down items should look like depending on active info
  let dropDownItems = null;

  if(props.activeInfo.contacts){
    // In case of a contact the current state of the friendship is taken into account and the 2 other posibilities are shown as options
    const statusArray = ['accepted','blocked','removed'];

    dropDownItems = statusArray.map(status => {
      if(status === props.indInfo.status){
        return null;
      }

      if(status === "accepted" && props.indInfo.status === "deleted"){
        return null;
      }

      let optionText = '';
      if(status === "accepted"){
        optionText = "Unblock";
      }else if(status === "blocked"){
        optionText = "Block";
      }else if(status === "removed"){
        optionText = "Remove";
      }

      return <Dropdown.Item 
              key={`${props.indInfo.convoId}_${optionText}`}
              onClick={e => {
                e.stopPropagation();
                props.clickDropdown(identifier);
                props.changeFriendshipStatus(props.indInfo.relation_id,identifier,status,props.token)
              }}>
                {optionText}
              </Dropdown.Item>;
    });
  }else if(props.activeInfo.groups){
    dropDownItems = (
      <>
      <Dropdown.Item 
        key={`${props.indInfo.convoId}_Leave_group`}
        onClick={e => {
          e.stopPropagation();
          props.clickDropdown(identifier);
          props.leaveGroup(props.token,props.mainUserId,identifier);
        }}
      >Leave Group</Dropdown.Item>

      {/* Permission is checked to see if to add the delete group option in the actions menu */}
      {props.indInfo.permission === "Admin" ? (
        <Dropdown.Item 
        key={`${props.indInfo.convoId}_delete_group`}
        onClick={e => {
          e.stopPropagation();
          props.clickDropdown(identifier);
          props.deleteGroup(props.token,identifier);
        }}
        >Delete Group</Dropdown.Item>
      ): null}
      </>
    );
  }else if(props.activeInfo.notifications){
    // Same logic as with a contact, it checks if a notification is read/unread and shows the posibility as an option along with remove
    const statusArray = ["read","unread","removed"];

    dropDownItems = statusArray.map(status => {
      if(status === props.indInfo.status){
        return null;
      }

      let optionText = '';
      if(status === "read"){
        optionText = "Mark As Read";
      }else if(status === "removed"){
        optionText = "Remove";
      }else if(status === "unread"){
        optionText = "Mark As Unread";
      }

      return <Dropdown.Item 
              key={`${props.indInfo.notificationId}_${optionText}`}
              onClick={e=> {
                e.stopPropagation();
                props.clickDropdown(identifier);
                props.changeNotificationStatus(identifier,status,props.token);
              }}
            >{optionText}</Dropdown.Item>;
    });
  }


  // Creating a custom toggle in order to stop propagation(bubbling) for toggle because the imported component didn't work as expected, not always toggling the actions menu
  const CustomToggle = React.forwardRef(({children,onClick},ref)=>(
    <div
      ref={ref}
      id={`dropdown_contact_${identifier}`} 
      onClick={e=>{
        e.stopPropagation();
        props.clickDropdown(identifier);
        // onClick(e);
      }}  
      >
        {children}
        &#x25bc;
    </div>
  ));

  
  // Establishing what the drop down should look like
  let dropDown = (
    <Dropdown className={classes.Dropdown} as="div" >
      <Dropdown.Toggle id={`dropdown-contact-actions-user-${identifier}`} as={CustomToggle} ></Dropdown.Toggle>

      {/* This approach was also taken because the DropDown comp didn't toggle visibility as it was supposed to */}
      {props.dropDown.id === identifier && props.dropDown.show ? (
        <Dropdown.Menu show={true} align="left">
          {dropDownItems}
        </Dropdown.Menu>
      ) : null}
    </Dropdown>
  );

  let content = (
    <>
      {/* The image of the group or contact , nothing is show in case of a notification */}
      {props.activeInfo.notifications ? null : <Image src={imgPath} roundedCircle height={50} width={50} className='mx-2'/>}
      
      <Row className={['flex-column m-0 flex-nowrap justify-content-center', props.activeInfo.notifications ? 'pl-4' : ''].join(' ')}>
        <div className={["d-flex"].join(' ')}>
          <strong>{name}</strong>
          
        </div>

        <div 
        className={['mb-0 d-flex',classes.LastMessage,props.activeInfo.notifications? !props.indInfo.minimized ? classes.Wrap: '': ''].join(' ')}
        >{checkmark}{lastMessage}{friendshipHandle}</div>
      </Row>

      <div className={["pr-1",classes.Date].join(' ')}>{date ? date : null}</div>

      {props.indInfo.unread_messages > 0 ? <Badge variant="success" className={['rounded-circle d-flex align-items-center py-1 px-2',classes.Badge].join(' ')}>{props.indInfo.unread_messages}</Badge> : null}

      {dropDown}
    </>
  );

  let mainItemClasses = ['d-flex px-0 pb-1 pt-1',classes.IndividualMiniInfo,props.activeInfo.notifications ? props.indInfo.status === 'unread' ? 'bg-warning' : '': ''];

  if(props.activeInfo.notifications && props.indInfo.status === "unread"){
    mainItemClasses.push('bg-warning');
  }

  let makeActive = true;

  if(props.activeInfo.contacts || props.activeInfo.groups){
    if(identifier === props.selectedId){
      mainItemClasses.push(classes.Selected);
      makeActive= false;
    }
  }

  if(props.indInfo.loading === true){
    content = <Spinner size="medium"/>
    mainItemClasses.push(classes.Loading);
  }

 
  return (
    <ListGroup.Item 
      action ={makeActive}
      className={mainItemClasses.join(' ')}
      onClick = {onClickFunction}
      as="li"
      >
      {content}
    </ListGroup.Item>
  )
}

export default individualMiniInfo;