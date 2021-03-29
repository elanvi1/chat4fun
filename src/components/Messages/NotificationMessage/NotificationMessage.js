import React from 'react';

import classes from './NotificationMessage.module.css';

// Component used show notifications in a group convo, they are similar to messages but they don't have a sender and can't be deleted.
const notificationMessage = (props) => {
  return (
    <div className={['pt-1 pb-3 my-2 px-2 bg-info text-light',classes.NotificationMessage].join(' ')}>
      <strong>{props.notification.title} : </strong>
      <span>{props.notification.message}</span>
      <div className={['text-light',classes.Date].join(" ")}>
        {props.timeOfDay}
      </div>
    </div>
  );
};

export default notificationMessage;