import React from 'react';

// import classes from './ModalUserInfo.module.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CustomInput from '../CustomInput/CustomInput';

// Component used in InfoUser in order to display a modal. It is used for displaying 3 modals:
// - For changing the email that contains 2 fields, one in which the user can enter the email and the other to enter the current password
// - For changing the password that contains 3 fields, one to enter the new password and the other 2 enter and confirm the new password.
// - For double confirmation of account deactivation.

const modalUserInfo = (props) => {
  let modalElements = null;
  
  if(props.type === "deactivate"){
    modalElements = "Are you sure you want to deactivate your account? You will be able to reactivate your account if you change your mind but all group info will be permanently lost";
  }else{
    modalElements = props.infoArray.filter(el => {
      if(props.showModal.password){
        return el.elemConfig.name === "new_password" || el.elemConfig.name === "password" || el.elemConfig.name === "new_password_confirmation";
      }
  
      return el.elemConfig.name === "email" || el.elemConfig.name === "password";
    }).map(el => {
      return (
        <CustomInput 
          key={`${el.elemConfig.name}_modal`}
          type="regular"
          editable={true}
          showEdit={false}
          el={el}
          changeInputHandler={props.changeInputHandler}
          mainUserInfo ={props.mainUserInfo}
          toggleEdit ={null}
        />
      )
    })
  }

  let myDisabled = props.type === 'email' ? 
    props.userInfo.email.valid && props.userInfo.password.valid  : props.type === "password" ?
    props.userInfo.password.valid && props.userInfo.new_password.valid && props.userInfo.new_password_confirmation.valid && props.userInfo.new_password.value === props.userInfo.new_password_confirmation.value : true;

  return (
    <Modal show={props.showModal[props.type]} onHide={props.handleCloseModal.bind(this,props.type)} >
      <Modal.Header  className="text-white" style={{background: "rgb(61, 109, 99)"}}>
        <Modal.Title>{props.type === 'email' ? 'Change Email' : props.type==="password" ? "Change Password" :"Deactivate Account"}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{background: "rgb(187, 198, 218)"}} className={["mb-0 pb-0",props.type==="deactivate" ? "pb-2 text-center" :''].join(' ')}>
        {modalElements}
      </Modal.Body>

      <Modal.Footer className="bg-secondary">
        <Button variant="danger" onClick={props.handleCloseModal.bind(this,props.type)} block>
          Close
        </Button>
        
        <Button 
          block
          variant="primary" 
          onClick={props.saveChanges} 
          disabled={!myDisabled}
        >
          {props.type === "deactivate" ? "Yes": "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default modalUserInfo;