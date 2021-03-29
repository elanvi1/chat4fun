import React from 'react';

import classes from './CustomInput.module.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger  from "react-bootstrap/OverlayTrigger";
import Form  from "react-bootstrap/Form";
import Spinner from '../Spinner/Spinner';

const customInput = (props) => {
  let input = null;
  // The tooltips for the edit and save signs.
  let editSign = (
    <OverlayTrigger
      placement="top"
      delay={{show:1050, hide:250}}
      overlay={
        <Tooltip id={`tooltip_edit_${props.el.elemConfig.id}`}>
          Edit
        </Tooltip>
      }
    >
      <i className="far fa-edit fa-2x" onClick={props.showEdit? props.toggleEdit.bind(this,props.el.elemConfig.name) : null}></i>
    </OverlayTrigger>
  );
  let saveSign = (
    <OverlayTrigger
        placement="top"
        delay={{show:1050, hide:250}}
        overlay={
          <Tooltip id={`tooltip_save_${props.el.elemConfig.id}`}>
            {props.el.valid ? "Save" : "Value not valid, can't save"}
          </Tooltip>
        }
    >
      <i 
        className={["fas fa-check fa-2x",props.el.valid ? classes.Valid : classes.Invalid].join(' ')}
        onClick={props.el.valid ? props.saveChanges : null}
      ></i>
    </OverlayTrigger>
  )

  // There are 3 types
  // Regular type is used to render a component that toggles between the 2 modes: edit and display. In display mode, the value of the element is shown and in edit mode a field is show where the user can add data. The editable property is also taken in consideration and in the eventuality it is false the edit mode will not be activated. This is applied in the InfoUser comp for the email where a modal opens instead of showing a field

  // File type is used to render a field from which the user can select an image and it also has a checkbox for no image. It is basically only in edit mode.

  // Succint type only shows the name of the attribute along with a edit sign. For example in the InfoUser comp for the password, no value is present and when clicking the edit sign a modal opens
  if(props.type === 'regular'){
    input = (
      <>
        <label htmlFor={props.el.elemConfig.id} className={classes.Label}>{props.el.label}</label>
        <InputGroup >
          {props.el.edit && props.editable? <FormControl
            as={props.el.elemType}
            type={props.el.elemConfig.type}
            aria-label={props.el.elemConfig.id}
            aria-describedby={props.el.elemConfig.id}
            id={props.el.elemConfig.id}
            placeholder={props.el.elemConfig.placeholder}
            name={props.el.elemConfig.name}
            value={props.el.value}
            onChange={event => props.changeInputHandler(event,props.el.elemConfig.name)}
          /> : (
            <div className={classes.NormalView}>
              {props.displayValue ? props.displayValue: 'N/A'}
            </div>
          )}
          
          <InputGroup.Append>
            <InputGroup.Text className={classes.InfoText}>
              {/* The edit property from state and the editable prop are used to determine which sign to show */}
              {props.el.edit && props.editable ? saveSign : editSign }
              </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <span className={[props.editable && props.el.edit && !props.el.valid && props.el.changed ? "text-danger" :"text-muted"].join(' ')}>
              {props.editable && props.el.edit && !props.el.valid && props.el.changed ? props.el.warning : props.el.subText}
        </span>
      </>
    );
  }else if (props.type === "file"){
      input = (
        <>
          <label htmlFor={props.el.elemConfig.id} className={classes.Label}>{props.el.label}</label>

          <InputGroup >
            <Form.File  
              id={props.el.elemConfig.id}
              name={props.el.elemConfig.name}
              label={props.el.elemConfig.placeholder}
              aria-label={props.el.elemConfig.id}
              aria-describedby={props.el.elemConfig.id}
              onChange={event => props.changeInputHandler(event,props.el.elemConfig.name)}
              custom/>

            <InputGroup.Append>
              <InputGroup.Text className={classes.InfoText}>
                {saveSign}
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>

          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={props.el.elemConfig.noImgId} disabled={!props.hasImage} onClick={props.noImageToggle}/>
            <label className="form-check-label" htmlFor={props.el.elemConfig.noImgId}>
              No Image
            </label>
          </div>

          <span className={[!props.el.valid && props.el.changed ? "text-danger" :"text-muted"].join(' ')}>
              {!props.el.valid && props.el.changed ? props.el.warning : props.el.subText}
          </span>
        </>
      );
  }else if(props.type === "succint"){
    input = (
      <>
        <InputGroup>
          <div className={classes.SuccintView}>{props.el.label}</div>
          
          <InputGroup.Append>
            <InputGroup.Text className={classes.InfoText}>
              {editSign}
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </>
    );
  }

  // A spinner is shown while awaiting a response from the server
  if(props.loading){
    input = (<Spinner size="medium"/>);
  }
 
  return (
    <div className={["bg-light px-3 py-2 mb-5 rounded",props.loading ? classes.Loading : null].join(' ')} >
      {input}
    </div>
  );
};

export default customInput;