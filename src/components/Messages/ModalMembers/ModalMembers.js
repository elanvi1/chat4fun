import React from 'react';
import moment from 'moment';

import classes from './ModalMembers.module.css';
import InputGroup  from "react-bootstrap/InputGroup";
import FormControl  from "react-bootstrap/FormControl";
import Button  from "react-bootstrap/Button";
import ListGroup  from "react-bootstrap/ListGroup";
import Modal  from "react-bootstrap/Modal";
import GroupMember from "../GroupMember/GroupMember";
import Spinner from "../../UI/Spinner/Spinner";

// Component used to show the members of a group. Each member is represented by a GroupMember comp.
const modalMembers = (props) => {
  let placeholder = "Member Name";
  let description = "Search for a member by using the username or alias if any";
  let members = props.groupInfo.members;
  let membersArray = [];

  // Comparing permissions of each group member so that they are shown in the following order from top to bottom: Admin, Add/Remove, Edit and Regular. If they have the same permission the member that has been in the group the longest is at the top
  const comparePermission = (perm1,perm2) => {
    if(perm1 === "Admin" && perm2 !== 'Admin'){
      return -1;
    }else if(perm1 === "Admin" && perm2 === "Admin"){
      return "compareDates";
    }else if(perm1 === "Add/Remove" && perm2 === "Admin"){
      return 1;
    }else if(perm1 === "Add/Remove" && perm2 === "Add/Remove"){
      return "compareDates";
    }else if(perm1 === "Add/Remove" && perm2 === "Edit"){
      return -1;
    }else if(perm1 === "Add/Remove" && perm2 === "Regular"){
      return -1;
    }else if(perm1 === "Edit" && perm2 === "Admin"){
      return 1;
    }else if(perm1 === "Edit" && perm2 === "Add/Remove"){
      return 1;
    }else if(perm1 === "Edit" && perm2 === "Edit"){
      return "compareDates";
    }else if(perm1 === "Edit" && perm2 === "Regular"){
      return -1;
    }else if(perm1 === "Regular" && perm2 !== "Regular"){
      return 1;
    }else{
      return "compareDates";
    }
  }

  // Creating an array containg info about each member from redux passed via MessagesInfoGroup, necessary for rendering hte GroupMember comp. 
  for(let el in members){
    membersArray.push({...members[el],myId:el});
  }


  // Filtering the array based on searched value entered by the user
  if(props.searchedValue){
    membersArray = membersArray.filter(member => {
      return member.username.toLowerCase().includes(props.searchedValue.toLowerCase()) || (member.alias ?member.alias.toLowerCase().includes(props.searchedValue.toLowerCase()) : false);
    });
  }

  membersArray = membersArray.sort((el1,el2)=>{
    if(el2){
      let permComp = comparePermission(el1.permission,el2.permission);
      if(permComp !== "compareDates"){
        return permComp;
      }else{
        let date1 = moment(el1.joined_at);
        let date2 = moment(el2.joined_at);
      
        return date1.diff(date2,'seconds');
      }
    }else{
      return 0;
    }
  });

 
  let canChangePerm = props.groupInfo.permission === "Admin";

  let membersBoxes = membersArray.map(member=>{
    return (
      <GroupMember
        key={member.myId}
        member={member}
        isMainUser={props.mainUserId === member.id}
        isInContacts={props.contacts[member.myId]}
        canRemove={props.groupInfo.permission === "Admin" ||(props.groupInfo.permission === "Add/Remove" && member.permission !== "Admin")}
        isPending={props.userIdsPendingFriendships.includes(member.id)}
        canChangePerm={canChangePerm}
        dropDown={props.dropDown}
        clickDropdown={props.clickDropdown}
        sendFriendshipRequest={props.sendFriendshipRequest}
        removeMember={props.removeMember}
        updatePermission={props.updatePermission}
      />
    )
  })

  let body = (
    <ListGroup 
      className={[classes.ListItems,props.loading ? classes.Loading : ''].join(' ')}
    >
      {props.loading ? <Spinner size = "large"/> : membersBoxes}
    </ListGroup>
  );

  return (
    <Modal 
      show={props.show} 
      onHide={props.toggleModal} 
      dialogClassName={classes.Modal}
      contentClassName={[classes.Modal].join(' ')}
      style={{height:'auto'}}
      onClick={props.clickDropdown.bind(this,0)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Members</Modal.Title>
      </Modal.Header>

     
      <InputGroup className={['px-2','py-2','bg-light'].join(' ')} size="lg">
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
      
      {body}
    </Modal>
  );
};

export default modalMembers;