import React from 'react';

import classes from './GroupMember.module.css';
import ListGroup  from "react-bootstrap/ListGroup";
import Image  from "react-bootstrap/Image";
import Row  from "react-bootstrap/Row";
import Dropdown  from "react-bootstrap/Dropdown";
import Badge from 'react-bootstrap/Badge'
import noAvatarImg from '../../../assets/no-avatar.jpg';


const groupMember = (props) => {
  const identifier = props.member.id;

  // Creating each drop down item depending on the permission the user has for that group. Each drop down item represents an action that can be taken on a member of the group. Check MessagesInfoGroup for more info. 
  let addToContactsDDI = !props.isInContacts ?  props.isPending ? (
    <Dropdown.Header>Friendship Request Pending</Dropdown.Header>
  ) :(
    <Dropdown.Item 
      key={`add_to_contacts_${identifier}`}
      onClick={e => {
        e.stopPropagation();
        props.clickDropdown(identifier);
        props.sendFriendshipRequest(identifier,true);
      }}
    >Add To Contacts</Dropdown.Item>
  ) : null;

  let removeFromGroupDDI = props.canRemove ? (
    <Dropdown.Item 
      key={`remove_from_group_${identifier}`}
      onClick={e => {
        e.stopPropagation();
        props.clickDropdown(identifier);
        props.removeMember(identifier);
      }}
    >Remove From Group</Dropdown.Item>
  ): null;

  let permsArray = ['Admin','Add/Remove','Edit','Regular'].filter(el=>el!==props.member.permission);
  let changePermissionDDI = props.canChangePerm ? (
    permsArray.map(perm => (
      <Dropdown.Item 
        key={`change_perm_to_${perm}_${identifier}`}
        onClick={e => {
          e.stopPropagation();
          props.clickDropdown(identifier);
          props.updatePermission(perm,identifier);
        }}
    >Change To {perm}</Dropdown.Item>
    ))
  ) : null;

  let dropDownItems =(
    <>
      {addToContactsDDI}
      {removeFromGroupDDI}
      {changePermissionDDI}
    </>
  );

  const CustomToggle = React.forwardRef(({children,onClick},ref)=>(
    <div
      ref={ref}
      id={`dropdown_member_${identifier}`}
      className={classes.Pointer} 
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

  // Establishing if the drop down should be shown for that member
  let showDropDown = !props.isMainUser && (!props.isInContacts || props.canRemove || props.canChangePerm);

  // Creating the dropdown for each member
  let dropDown = showDropDown ? (
    <Dropdown className="align-self-end ml-auto mr-2" as="div" >
      <Dropdown.Toggle id={`dropdown-member-actions-${identifier}`} as={CustomToggle} ></Dropdown.Toggle>

      {props.dropDown.id === identifier && props.dropDown.show ? (
        <Dropdown.Menu show={true} align="left">
          {dropDownItems}
        </Dropdown.Menu>
      ) : null}
    </Dropdown>
  ) : null;

  let variant="light"
  const permission = props.member.permission;

  if(permission==="Admin"){
    variant = "success";
  }else if(permission==="Add/Remove"){
    variant = "primary";
  }else if(permission==="Edit"){
    variant = "info";
  }else if(permission==="Regular"){
    variant = "secondary"
  }
  

  let permissionEl = <Badge pill variant={variant} className={classes.Permission}>{props.member.permission}</Badge>

  let imgPath = props.member.image ? props.member.image : noAvatarImg;


  return (
    <ListGroup.Item 
      action
      className={['d-flex px-0 pb-1 pt-2 align-items-center position-relative'].join(' ')}
      as="li"
    >
      <Image src={imgPath} roundedCircle height={50} width={50} className='mx-2'/>

      <Row className={['flex-column m-0 mr-3'].join(' ')}>
        <strong>{props.member.alias ? props.member.alias: props.member.username}</strong>
        <div className={['mb-0',classes.About].join(' ')}>{props.member.about}</div>
      </Row>

      {dropDown}

      {permissionEl}
    </ListGroup.Item>
  );
};

export default groupMember;