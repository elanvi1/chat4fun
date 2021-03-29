import React from 'react';
import moment from 'moment';

import noAvatarImg from '../../../assets/no-avatar.jpg';
import classes from './InfoMain.module.css';

import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import InputGroup  from "react-bootstrap/InputGroup";
import FormControl  from "react-bootstrap/FormControl";
import Button  from "react-bootstrap/Button";
import ListGroup  from "react-bootstrap/ListGroup";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger  from "react-bootstrap/OverlayTrigger";
import Badge  from "react-bootstrap/Badge";
import IndividualMiniInfo from '../IndividualMiniInfo/IndividualMiniInfo'; 

// Info main is a secondary component of the Info Column
// It contains:
// - Header which in turn has:
//  - users image/avatar, 
//  - a plus icon that toggles the visibility of the addition Menu which in turn has:
//   - Add Contact Option which shows the AddContact comp and removes the InfoMain comp
//   - Create Group Option which shows the CreateGroup Comp and removes the InfoMain Comp
//  - Edit Icon which shows the InfoUser comp and removes the InfoMain Comp
//  - Log Out Icon which logs the user out of the app
// - Tabs group which contains the Contacts, Groups and Notification tabs.
// - Input field to search for contact, group or notification
// - A list of values that are shown depending on which tab is selected. Each value is represented by the IndividualMiniComponent

const infoMain = (props)=> {
  let arrayListItems = [];
  let unreadMessagesContacts = 0;
  let unreadMessagesGroups = 0;
  let unreadNotifications = 0;

  // props.active info is used to determine which tab is active
  // props.otherUsers, props.groups and props.notifications represent all the info about contacts,groups and notification respectavaey, taken from the redux store in the Main comp and passed here

  // Depending on which tab is active the information about each contact,group or notification is stored in array
  // in order to render the IndividualMiniInfo comp
  for(let el in props.otherUsers){
    unreadMessagesContacts += props.otherUsers[el].unread_messages;
    if(props.activeInfo.contacts){
      arrayListItems.push({...props.otherUsers[el],convoId: el});
    }
  }
  
  for(let el in props.groups){
    unreadMessagesGroups += props.groups[el].unread_messages;
    if(props.activeInfo.groups){
      arrayListItems.push({...props.groups[el],convoId: el});
    }
  }
  
  
  for(let el in props.notifications){
    if(props.notifications[el].status === "unread"){
      unreadNotifications +=1;
    }
    if(props.activeInfo.notifications){
      arrayListItems.push({...props.notifications[el],notificationId: el})
    }
  }
  
  
  // The array is sorted depending on type, in such a way that the latest info is at the top
  arrayListItems = arrayListItems.sort((el1,el2)=>{
    if(el2){
      if(props.activeInfo.contacts || props.activeInfo.groups){
        if(el1.last_message && !el2.last_message){
          return -1;
        }else if(!el1.last_message && el2.last_message){
          return 1;
        }else if(!el1.last_message && !el2.last_message){
          let date1 = null;
          let date2 = null;
          
          if(props.activeInfo.groups){
            date1 = moment(el1.joined_at);
            date2 = moment(el2.joined_at);
          }else if(props.activeInfo.contacts){
            date1 = moment(el1.added_at);
            date2 = moment(el2.added_at);
          }
  
          return -date1.diff(date2,'seconds');
        }else{
          let date1 = moment(el1.last_message.created_at);
          let date2 = moment(el2.last_message.created_at);
  
          return -date1.diff(date2,'seconds');
        }
      }
      let date1 = moment(el1.created_at);
      let date2 = moment(el2.created_at);
      
      return -date1.diff(date2,'seconds');
    }else{
      return 0;
    }
  })

  // If there is a searched value then the array is filtered so that only the individual info that match the criteria is shown
  if(props.searchedValue){
    if(props.activeInfo.contacts){
      //  For contacts it checks for a match in username and alias(if any)
      arrayListItems = arrayListItems.filter(contact => {
        return contact.username.toLowerCase().includes(props.searchedValue.toLowerCase()) || (contact.alias ?contact.alias.toLowerCase().includes(props.searchedValue.toLowerCase()) : false);
      });
    }else if(props.activeInfo.groups){
      //  For group in checks for a match in the name of the group
      arrayListItems = arrayListItems.filter(group => {
        return group.name.toLowerCase().includes(props.searchedValue.toLowerCase());
      });
    }else if(props.activeInfo.notifications){
      // For notifications in checks for a match in the title or message of the notification
      arrayListItems = arrayListItems.filter(notification => {
        return notification.message.toLowerCase().includes(props.searchedValue.toLowerCase()) || notification.title.toLowerCase().includes(props.searchedValue.toLowerCase()); 
      });
    }
  }

  let onClickFunction = null;

  // Depending on which tab is active a function is assigned to handle the click of a particular ind info
  if(props.activeInfo.notifications){
    onClickFunction = props.clickNotification;
  }else if(props.activeInfo.contacts){
    onClickFunction = props.clickContact;
  }else if(props.activeInfo.groups){
    onClickFunction = props.clickGroup;
  }

  // The IndividualMiniInfo comps are created based on the array
  let listItems = arrayListItems.map(info => {
    return (
      <IndividualMiniInfo 
        key={props.activeInfo.notifications ? info.notificationId:info.convoId} 
        indInfo={info} 
        activeInfo={props.activeInfo} 
        mainUserId={props.mainUser.id}
        selectedId={props.activeInfo.contacts ? props.selectedContactId : props.activeInfo.groups ? props.selectedGroupId : 0} 
        dropDown ={props.dropDown}
        token = {props.token}
        onClickFunction={onClickFunction} 
        handleFriendshipRequest={props.activeInfo.notifications ? props.handleFriendshipRequest : null}
        clickDropdown={props.clickDropdownMini}
        changeFriendshipStatus={props.activeInfo.contacts ?props.changeFriendshipStatus : null}
        leaveGroup={props.activeInfo.groups ? props.leaveGroup:null}
        deleteGroup={props.activeInfo.groups ? props.deleteGroup:null}
        changeNotificationStatus={props.activeInfo.notifications ? props.changeNotificationStatus : null}
      />
    )
  });

  // Setting the image path to the image from info or if there isn't one to an image from assets
  let imagePath = props.mainUser.image ? props.mainUser.image : noAvatarImg;

  let placeholder = '';
  let description = '';

  if(props.activeInfo.contacts){
    placeholder = 'Contact user/alias';
    description = 'Enter the username or alias of the alias you are looking for';
  }else if(props.activeInfo.groups){
    placeholder = 'Group name';
    description = 'Enter the name of the group you are looking for';
  }else if(props.activeInfo.notifications){
    placeholder = 'Notification title/message';
    description = "Enter the parts of the title or message of the notification you are looking for"
  }

  const tooltipUserInfo = (props) => (
    <Tooltip id="tooltipUserInfo" {...props}>
      Edit Account Info
    </Tooltip>
  )

  return (
      <div className={classes.InfoMain}>
        {/* --------------------------HEADER---------------------------------- */}
        <Row className={['py-3 align-items-center flex-nowrap mx-0',classes.HeaderInfoMain].join(' ')}>
          <Image src={imagePath} roundedCircle height={40} width={40} className='mx-2'/>

          <strong className='text-dark mx-2'>{props.mainUser.username}</strong>

          
          <div className={["ml-auto mx-2 position-relative"].join(' ')} >
            <OverlayTrigger
            placement="left"
            delay={{show:850, hide:0}}
            overlay={
              <Tooltip id={`tooltip_addition}`}>
                Menu Addition
              </Tooltip>
            }
            >
              <i 
                className={["fas fa-plus-circle fa-2x",classes.InfoAddIcons].join(' ')}
                onClick={e => {
                  e.stopPropagation();
                  props.handleDropDownAddition();
                }}
              ></i>
            </OverlayTrigger>

            {props.dropDownAddition ? (
              <ul className={["dropdown-menu",classes.DropDownAddition].join(' ')}>
                <li 
                  className={["dropdown-item",classes.InfoAddIcons].join(' ')}
                  onClick={props.changeActiveInfoColumn.bind(this,'addContact')}
                >Add Contact</li>
                <li 
                  className={["dropdown-item",classes.InfoAddIcons].join(' ')}
                  onClick={props.changeActiveInfoColumn.bind(this,'createGroup')}
                >Create Group</li>
              </ul>
            ) : null}
          </div>
       

          <OverlayTrigger placement="bottom" delay={{show:850,hide:0}} overlay={tooltipUserInfo}>
            <i 
              className={["fas fa-user-edit fa-2x mx-2",classes.InfoAddIcons].join(' ')}
              onClick={props.changeActiveInfoColumn.bind(this,'infoUser')}
            ></i>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            delay={{show:850, hide:0}}
            overlay={
              <Tooltip id={`tooltip_logout}`}>
                Logout
              </Tooltip>
            }
          >
            <i 
              className={["fas fa-sign-out-alt fa-2x mx-2 text-danger",classes.InfoAddIcons].join(' ')}
              onClick={props.logout}
            ></i>
          </OverlayTrigger>
        </Row>
        {/* ------------------------------------------------------- */}

        {/*-------------------TABS LIST --------------------------- */}
        <ListGroup horizontal className={classes.Options}>
          <ListGroup.Item action variant="dark" active={props.activeInfo.contacts} onClick={props.changeActiveInfo.bind(this,'contacts')} className="text-center position-relative rounded-0 border-top-0">
            Contacts{unreadMessagesContacts>0 ? <Badge variant="success" className={['rounded-circle d-flex align-items-center py-1 px-2',classes.Badge].join(' ')}>{unreadMessagesContacts}</Badge> : null}
          </ListGroup.Item>

          <ListGroup.Item action variant="dark" active={props.activeInfo.groups} onClick={props.changeActiveInfo.bind(this,'groups')} className="text-center position-relative rounded-0 border-top-0">
            Groups{unreadMessagesGroups>0 ? <Badge variant="success" className={['rounded-circle d-flex align-items-center py-1 px-2',classes.Badge].join(' ')}>{unreadMessagesGroups}</Badge> : null}
          </ListGroup.Item>

          <ListGroup.Item action variant="dark" active={props.activeInfo.notifications} onClick={props.changeActiveInfo.bind(this,'notifications')} className="text-center position-relative rounded-0 border-top-0">
            Notifications{unreadNotifications>0 ? <Badge variant="success" className={['rounded-circle d-flex align-items-center py-1 px-2',classes.Badge].join(' ')}>{unreadNotifications}</Badge> : null}
          </ListGroup.Item>
        </ListGroup>
        {/* ------------------------------------------------------- */}

        {/* ---------- Input for the searched value --------------- */}
        <InputGroup className={[classes.SearchBar,'px-2','py-2','bg-light'].join(' ')} size="lg">
          <FormControl
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={description}
            onChange={props.changeSearchedValue}
            value={props.searchedValue}
          />

          <InputGroup.Append className="d-block">
            <Button variant="outline-secondary" >
              <i className="fas fa-search "></i>
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {/* ------------------------------------------------------- */}

        {/*-------- The list with IndividualMiniInfo comps -------- */}
        <ListGroup className={[classes.ListItems,'bg-light'].join(' ')}>
          {listItems}
        </ListGroup>
        {/* ------------------------------------------------------- */}
      </div>
  );
};

export default infoMain;