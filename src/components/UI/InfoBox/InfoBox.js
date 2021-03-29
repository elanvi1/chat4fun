import React from 'react';

import classes from "./InfoBox.module.css";

// Component used to display info about a group or contact, without the option to edit it. Used in MessagesInfoContact and MessagesInfoGroup
const infoBox = (props) => {
  let newTitle = props.title;

  if(props.title.includes('_')){
    let newTitleArray = props.title.split('_');
    newTitle = newTitleArray.join(" ");
  }
  
  return (
    <div className={['bg-light px-3 py-2 mb-5 rounded'].join(' ')}>
      <div className={classes.Title}>{newTitle}</div>
      <strong>{props.value ? props.value : 'N/A'}</strong>
    </div>
  );
};

export default infoBox;