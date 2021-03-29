import React from 'react';

// import classes from './DateMessage.module.css';

// Component used to render the date in a conversation. 
const dateMessage = (props) => {
  
  return (
    <div className="mx-auto p-2 bg-dark text-white rounded-pill my-4">
      {props.children}
    </div>
  );
};

export default dateMessage;