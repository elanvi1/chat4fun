import React,{Component} from 'react';
import {connect} from 'react-redux';

import classes from './InfoUser.module.css';
import noAvatarImg from '../../assets/no-avatar.jpg';
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import CustomInput from '../../components/UI/CustomInput/CustomInput';
import ModalUserInfo from '../../components/UI/ModalUserInfo/ModalUserInfo';
import * as actions from '../../store/actions/index';


class InfoUser extends Component {
  // InfoUser state is used to create the different fields required to edit account info. In here the validity of each value that the user inputs is also being kept track of. 
  // The state is also used to keep track of the visibility of certain modals which hold the necessary fields for edditing account info. 

  // Each field has 2 modes (except password and image), one is for display purposes where the information about the account is shown and the other is for editing purposes, where a field is shown where the user can add the desired data.
  
  // The account image/avatar is always shown at the top as well as the field for changing that image.

  // The email is always shown and in order to change it, a modal will open where the user enters the new email along with the current password.

  // Password isn't shown anywhere an in order to change, a modal will open where the user enters the old password, the new password and a confirmation of the new password.

  state = {
    userInfo: {
      name: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder:"New Name",
          name: "name",
          id: "name",
        },
        warning:'At least 1 character required',
        subText:'We\'ll never share your name with anyone else',
        label: "Name",
        value: "",
        validation: {
          required: true,
          maxLength: 189
        },
        edit:false,
        valid: false,
        changed: false,
      },
      username: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder:"New Username",
          name: "username",
          id: "username",
        },
        warning:'At least 1 character required and a maximum of 17',
        subText:'This is the public name by which you will be seen by other users',
        label: "Username",
        value: "",
        validation: {
          required: true,
          maxLength: 17
        },
        edit:false,
        valid: false,
        changed: false,
      },
      about:{
        elemType: "textarea",
        elemConfig: {
          placeholder:"New Description About You",
          name: "about",
          id: "about",
        },
        warning:'Description can\'t have more than 120 characters',
        subText:'Write a short description about yourself which will be seen by other users',
        label: "About ",
        value: "",
        validation: {
          maxLength: 120
        },
        edit:false,
        valid: true,
        changed: false,
      },
      image:{
        elemType: "input",
        elemConfig: {
          type:'file',
          placeholder:"New Avatar",
          name: "image",
          id: "image",
          noImgId:"noImageUser"
        },
        warning:'File must be an image of format jpeg,jpg,png,gif,webp and can\'t have a size greater than 2 MB',
        subText:'Select an image for your avatar',
        label: "Avatar ",
        value: null,
        validation: {
          imageRequirements: true,
        },
        valid: false,
        changed: false,
      },
      email: {
        elemType: "input",
        elemConfig: {
          type: "email",
          placeholder:"New Email",
          name: "email",
          id: "email",
        },
        warning:'Needs to have format ...@...[.]... and be different from the previous one',
        subText:'After a successful email change a verification email will be sent. You will be logged out and only be able to log in after the verification is complete',
        label: "Email",
        value: "",
        validation: {
          required: true,
          isEmail: true,
          maxLength: 189
        },
        edit:true,
        valid: false,
        changed: false,
      },
      password: {
        elemType: "input",
        elemConfig: {
          type: "password",
          placeholder: "Current Password",
          name: "password",
          id: "password",
        },
        warning:'Needs to have at least 6 characters',
        subText:'We\'ll never share your password with anyone else',
        label: "Password",
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 189
        },
        edit:true,
        valid: false,
        changed: false,
      },
      new_password: {
        elemType: "input",
        elemConfig: {
          type: "password",
          placeholder: "New Password",
          name: "new_password",
          id: "new_password",
        },
        warning:'Needs to have at least 6 characters',
        label: "New Password",
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 189
        },
        edit:true,
        valid: false,
        changed: false,
      },
      new_password_confirmation: {
        elemType: "input",
        elemConfig: {
          type: "password",
          placeholder: "New Password",
          name: "new_password_confirmation",
          id: "new_password_confirmation",
        },
        warning:'Needs to have at least 6 characters',
        label: "Confirm New Password",
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 189
        },
        edit:true,
        valid: false,
        changed: false,
      },
    },
    showModal:{
      email: false,
      password: false,
      deactivate:false
    }
  }
  
  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
  changeInputHandler = (event, elemIdentifier) => {
    let value = elemIdentifier === 'image' ? event.target.files[0] : event.target.value;

    const updatedInfo = {
      ...this.state.userInfo,
      [elemIdentifier]: {
        ...this.state.userInfo[elemIdentifier],
        value: value,
        valid: this.validationHandler(
          this.state.userInfo[elemIdentifier].validation,
          value
        ),
        changed: true,
      },
    };

    // If an image is added, I make sure that the no image checkmark isn't selected
    if(elemIdentifier === 'image'){
      document.getElementById("noImageUser").checked = false;
    }

    this.setState({ 
      userInfo: updatedInfo
    });
  };

  //Checks the validation of the info entered by the user in the fields.
  validationHandler(rules, value) {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      
      isValid = pattern.test(value) && this.props.mainUserInfo.email !== value && isValid;
    }

    if(rules.imageRequirements){
      let imgInfo = value.type.split('/');
      let acceptedTypes = ['jpeg','jpg','png','gif','webp'];

      let isImage = imgInfo[0] === 'image';
      let isRightFormat = acceptedTypes.includes(imgInfo[1]);
      let isRightSize = value.size < 2097152;

      isValid = isImage && isRightFormat && isRightSize && isValid;
    }

    return isValid;
  }

  // Toggle between the modes of a certain element: edit and display. For password and email it's a little different because a modal will open and additional information is requested in order to edit them
  toggleEdit = (name) => {
    if(name === "image"){
      document.getElementById("image").value = "";
    }

    this.setState(prevState => {
      return {
        ...this.state,
        userInfo:{
          ...this.state.userInfo,
          [name]:{
            ...this.state.userInfo[name],
            edit: !prevState.userInfo[name].edit,
            changed:false,
            valid:name === "about" ? true : false,
            value:""
          }
        }
       
      }
    })
  }

  // Sets the value to null in the state for the image element along with the value of the dom element. 
  noImageToggle = (e) => {
    document.getElementById("image").value = "";

    this.setState({
      ...this.state,
      userInfo:{
        ...this.state.userInfo,
        image:{
          ...this.state.userInfo.image,
          valid:e.target.checked,
          changed:false,
          value:null
        }
      }
    });
  }

  // Resets the state when closing the modal
  handleCloseModal = (name) => {
    let resetElements = {};
    let containedElements = name === "email" ? ['email','password'] : name ==="password" ? ['password','new_password','new_password_confirmation']: [];

    if(name === "email" || name === "password"){
      for(let el in this.state.userInfo){
        if(containedElements.includes(el)){
          resetElements[el] = {
            ...this.state.userInfo[el],
            value:'',
            valid:false,
            changed:false
          }
        }
      }
    }
    
    this.setState({
      ...this.state,
      userInfo:{
        ...this.state.userInfo,
        ...resetElements
      },
      showModal:{
        ...this.state.showModal,
        [name]:false
      }
    })
  }

  // Toggles the state property responsible for the visibility of a certain modal
  handleOpenModal = (name) => {
    this.setState({
      ...this.state,
      showModal:{
        ...this.state.showModal,
        [name]:true
      }
    })
  }

  // Method triggered when saving the changes made by the user, only available if the provided info is valid. 
  saveChanges = (attribute) => {
    let payload = {};
    let contentsArray = attribute === 'email' ? ['email','password'] : attribute === 'password' ? ['password','new_password','new_password_confirmation'] : [attribute];

    // Setting the payload that will be sent to the server
    for(let el in this.state.userInfo){
      if(contentsArray.includes(el)){
        payload[el] = this.state.userInfo[el].value
      }
    }

    if(attribute === "email" || attribute === "password"){
      this.handleCloseModal(attribute);
    }else{
      this.toggleEdit(attribute);
    }
   
    // For more info check store->actions->info
    this.props.onChangeMainUserInfo(attribute,payload,this.props.mainUserInfo.id,this.props.token);
  }

  render(){
    let infoArray = [];

   // An array is created with the information from the state in order to render the components that hold the necessary fields
    for(let elem in this.state.userInfo){
      infoArray.push(this.state.userInfo[elem]);
    }

    let userInfo = infoArray.map(el=>{
      if(el.elemConfig.type === 'file'){
        return (
          <CustomInput
            key={el.elemConfig.name}
            type="file"
            el={el}
            loading={this.props.loading[el.elemConfig.name]}
            hasImage={this.props.mainUserInfo.image}
            changeInputHandler={this.changeInputHandler}
            noImageToggle={this.noImageToggle}
            saveChanges={this.saveChanges.bind(this,el.elemConfig.name)}
          />
        )
      }else {
        if(el.elemConfig.name === 'new_password'|| el.elemConfig.name === 'new_password_confirmation'){
          return null;
        }
        if(el.elemConfig.name === 'password'){
          return (
            <CustomInput
              key={el.elemConfig.name}
              type="succint"
              el={el}
              loading={this.props.loading[el.elemConfig.name]}
              toggleEdit={this.handleOpenModal}
              showEdit={true}
            />
          )
        }

        return (
          <CustomInput 
            key={el.elemConfig.name}
            type="regular"
            editable={el.elemConfig.name ==="email" ? false : true}
            showEdit={true}
            el={el}
            loading={this.props.loading[el.elemConfig.name]}
            changeInputHandler={this.changeInputHandler}
            displayValue ={this.props.mainUserInfo[el.elemConfig.name]}
            toggleEdit ={el.elemConfig.name ==="email" ? this.handleOpenModal :this.toggleEdit}
            saveChanges={this.saveChanges.bind(this,el.elemConfig.name)}
          />
        )
      }
    });

    let imagePath = this.props.mainUserInfo.image ? this.props.mainUserInfo.image : noAvatarImg;

    let modalArray = ['email','password','deactivate'];

    // These are the modals that are rendered if the user wants to change his email, password or deactivate the account.

    let modals = modalArray.map(el => {
      if(el === "deactivate"){
        return (
          <ModalUserInfo
            key={`modal_${el}`}
            type={el}
            showModal={this.state.showModal}
            handleCloseModal={this.handleCloseModal}
            saveChanges={this.props.onDeactivateAccount.bind(this,this.props.token,this.props.mainUserInfo.id)}
          />
        )
      }
      return (
        <ModalUserInfo 
          key={`modal_${el}`}
          type={el}
          infoArray={infoArray}
          showModal={this.state.showModal}
          mainUserInfo={this.props.mainUserInfo}
          userInfo={this.state.userInfo}
          changeInputHandler={this.changeInputHandler}
          handleCloseModal={this.handleCloseModal}
          saveChanges={this.saveChanges.bind(this,el)}
        />
      )
    });

    return (
      <div className={[classes.InfoUser].join(' ')} >
        <div className={classes.Header}>
            <i 
              className={["fas fa-arrow-left mr-4",classes.BackArrow].join(' ')}
              onClick={this.props.changeActiveInfoColumn.bind(this,'infoMain')}></i>
            <strong className="text-light text-center">Account Info</strong>
        </div>

        <div className={["d-flex justify-content-center",classes.ImageDiv].join(' ')}>
          <Image src={imagePath} roundedCircle fluid  className=''/>
        </div>

        {userInfo}

        <Button variant="danger" size="lg" block onClick={this.handleOpenModal.bind(this,'deactivate')}>
          Deactivate Account
        </Button>

        {modals}
      </div>
    )
  }
}

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    mainUserInfo: state.info.mainUser,
    loading: state.info.loadingMainUserInfo
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".

const mapDispatchToProps = dispatch => {
  return {
   onChangeMainUserInfo: (attribute,payload,mainUserId,token) => dispatch(actions.changeMainUserInfo(attribute,payload,mainUserId,token)),

   onDeactivateAccount: (token,mainUserId) => dispatch(actions.deactivateAccount(token,mainUserId))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(InfoUser);