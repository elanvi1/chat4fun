import React from 'react';

import classes from './Spinner.module.css';

const spinner = (props) => {
  let classArray = [classes.Loader];

  if(props.size === 'medium'){
    classArray.push(classes.Medium);
  }else if(props.size ==='large'){
    classArray.push(classes.Large);
  }
  return (
  <div className={classArray.join(' ')}>Loading...</div>
  )
};

export default spinner;