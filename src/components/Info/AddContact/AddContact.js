import React from 'react';

import classes from './AddContact.module.css';

import InputGroup  from "react-bootstrap/InputGroup";
import FormControl  from "react-bootstrap/FormControl";
import Button  from "react-bootstrap/Button";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger  from "react-bootstrap/OverlayTrigger";
import ListGroup  from "react-bootstrap/ListGroup";
import Spinner from '../../UI/Spinner/Spinner';
import AddUserTo from '../../AddUserTo/AddUserTo';

// Component used to search for users that the main users would like to add in his contact list. It has an input field to enter the username of the user and after searching a list of AddUserTo comps is displayed in order to facilitate the process. 
const addContact = (props) => {
  let listItems = null;
  let listItemsArray = [];

  // An array is created based on the info received from the server in order to render the list of AddUserTo comps
  if(props.contactsForAdd.list){
    for(let el in props.contactsForAdd.list){
      listItemsArray.push({...props.contactsForAdd.list[el],myKey:el});
    }

    listItems = listItemsArray.map(userInfo => {
      return (
        <AddUserTo 
          key={userInfo.myKey}
          userInfo={userInfo}
          addType="toList"
          sendRequest={props.sendFriendshipRequest.bind(this,userInfo.id)}
        />
      )
    });
  }

  // While waiting to receive the info from the server a Spinner is shown
  let list = props.contactsForAdd.loading ? <Spinner size = "large"/> : (
    listItems
  );
  return (
    <div className={classes.AddContact}>
      <div className={classes.Header}>
        <i 
          className={["fas fa-arrow-left mr-4",classes.BackArrow].join(' ')}
          onClick={props.changeActiveInfoColumn.bind(this,'infoMain')}></i>
        <strong className="text-light">Add Contact</strong>
      </div>

      <InputGroup className={[classes.SearchBar,'px-2','py-2','bg-light'].join(' ')} size="lg">
        <OverlayTrigger
          placement="top"
          delay={{show:850, hide:0}}
          overlay={
            <Tooltip id={`tooltip_clear_add_contact_search_results}`}>
              Clear View
            </Tooltip>
          }
        >
          {/* Button used to delete the list of users for addition*/}
          <InputGroup.Prepend className="d-block">
            <Button variant="outline-danger" disabled={!props.contactsForAdd.message} onClick={props.clearContacts}>
              <i className="far fa-trash-alt"></i>
            </Button>
          </InputGroup.Prepend>
        </OverlayTrigger>

        <FormControl
          placeholder="Contact username"
          aria-label="Contact Username"
          aria-describedby="Enter the username of the user you are trying to add or an approximate value of it"
          onChange={props.changeSearchedValue}
          onKeyPress={e => {
            if(e.key === "Enter"){
              props.getContactsForAdd();
            }
          }}
          value={props.searchedValue}
        />

        <InputGroup.Append className="d-block">
          <Button variant="outline-secondary" disabled={!props.searchedValue.trim()} onClick={props.getContactsForAdd}>
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup.Append>
      </InputGroup>

      {props.contactsForAdd.message ? (
        <div className="bg-info text-white fs-6 text-center">{props.contactsForAdd.message}</div>
      ): null}
      
      <ListGroup 
        className={[classes.ListItems,props.contactsForAdd.loading ? classes.Loading : ''].join(' ')}
      >
        {list}
      </ListGroup>
    </div>
  );
};

export default addContact;