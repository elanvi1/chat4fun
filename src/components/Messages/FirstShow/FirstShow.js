import React from 'react';

import classes from './FirstShow.module.css';
import Image  from "react-bootstrap/Image";
import logoBig from '../../../assets/logo-big.png';

// Component rendered when the app finishes loading. And when the selected group/contact is removed.
const firstShow = (props) => {
  return (
    <div className={["d-flex flex-column justify-content-center align-items-center",classes.FirstShow].join(' ')}>
      <Image src={logoBig} fluid rounded />
      <h1 className="text-center">Chat4fun</h1>
      <p className="text-center">Welcome to chat4un, a place where ...well the name is pretty self explanitory.</p>
      <p className="text-center">You can select a chat from the contacts and groups tabs. If you receive a notification you can check it out under the notifications tab</p>
    </div>
  );
};

export default firstShow;