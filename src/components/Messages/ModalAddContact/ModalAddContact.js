import React from 'react';

import classes from './ModalAddContact.module.css';
import InputGroup  from "react-bootstrap/InputGroup";
import FormControl  from "react-bootstrap/FormControl";
import Button  from "react-bootstrap/Button";
import ListGroup  from "react-bootstrap/ListGroup";
import Modal  from "react-bootstrap/Modal";
import AddUserTo from "../../AddUserTo/AddUserTo";
import Spinner from "../../UI/Spinner/Spinner";

// Modal used to display the contacts that can be added to a group. Each contact is represented by a AddUserTo comp 
const modalAddContact = (props) => {
  let placeholder = "Contact for add to group";
  let description = "Search your contact list for someone to add to the group";
  let members = props.groupInfo.members;

  let contactsArray = [];
  let contactsForAddArray = [];

  // Create an array with the info from redux passed via MessagesInfoGroup comp, necessary to render the AddUserTo comps
  if(props.contacts){
    for(let contact in props.contacts){
      contactsArray.push({...props.contacts[contact],myKey:contact});
    }
  }
 
  // Filtering the array so that only contacts with which both friendships are shown. 
  contactsForAddArray = contactsArray.filter(contact => {
    return !members[contact.myKey] && contact.status === "accepted" && contact.other_status === "accepted";
  })

  // Filtering the array based on the searched value by the user
  if(props.searchedValue){
    contactsForAddArray = contactsForAddArray.filter(contact => {
      return contact.username.toLowerCase().includes(props.searchedValue.toLowerCase()) || (contact.alias ?contact.alias.toLowerCase().includes(props.searchedValue.toLowerCase()) : false);
    });
  }
  
  let contactsForAdd = contactsForAddArray.map(contact => {
    return (
      <AddUserTo 
        key={contact.myKey}
        userInfo={contact}
        addType="toGroup"
        sendRequest={props.addContactToGroup.bind(this,contact)}
      />
    )
  });

  let body = contactsForAdd.length > 0 ? (
    <ListGroup 
      className={[classes.ListItems,props.loading ? classes.Loading : ''].join(' ')}
    >
      {props.loading ? <Spinner size = "large"/> : contactsForAdd}
    </ListGroup>
  ) : (
    <div className="bg-warning text-center px-1">There are no contacts to add to this group</div>
  );

  return (
    <Modal 
      show={props.show} 
      onHide={props.toggleModal} 
      dialogClassName={classes.Modal}
      contentClassName={[classes.Modal].join(' ')}
      style={{height:'auto'}}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add contact to group</Modal.Title>
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

      <div className="bg-info text-center px-3">You can only add contacts which are in your contact list that aren't blocked and in turn they have you in their contact list not blocked</div>
      {body}
     
    </Modal>
  );
};

export default modalAddContact;