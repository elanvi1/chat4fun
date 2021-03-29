import React from 'react';

import classes from './AddUserTo.module.css';
import ListGroup  from "react-bootstrap/ListGroup";
import Image  from "react-bootstrap/Image";
import Row  from "react-bootstrap/Row";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger  from "react-bootstrap/OverlayTrigger";
import noAvatarImg from '../../assets/no-avatar.jpg';

// Component shows succint info about a user and gives the main user the ability to add the user to his contact list be it from the AddContact comp or from a group(MessagesInfoGroup comp).

const addUserTo = (props) => {

  let imgPath = props.userInfo.image ? props.userInfo.image : noAvatarImg;
  return (
    <ListGroup.Item 
      action
      className={['d-flex px-0 pb-1 pt-2',classes.AddUserTo].join(' ')}
      as="li"
    >
      <Image src={imgPath} roundedCircle height={50} width={50} className='mx-2'/>

      <Row className={['flex-column m-0 mr-2'].join(' ')}>
        <strong>{props.userInfo.alias ? props.userInfo.alias: props.userInfo.username}</strong>
        <div className={['mb-0',classes.About].join(' ')}>{props.userInfo.about}</div>
      </Row>

      <OverlayTrigger
          placement="top"
          delay={{show:850, hide:0}}
          overlay={
            <Tooltip id={`tooltip_add_contact${props.addType === 'toGroup' ? '_to_group' : ''}_${props.userInfo.myKey}}`}>
              {props.addType === "toList" ? 'Send Request' : "Add to group"}
            </Tooltip>
          }
      >
        <i 
          className={["fas fa-plus-square fa-2x text-success ml-auto mr-3",classes.AddSign].join(' ')}
          onClick={props.sendRequest}
        ></i>
      </OverlayTrigger>
    </ListGroup.Item>
  );
};

export default addUserTo;

