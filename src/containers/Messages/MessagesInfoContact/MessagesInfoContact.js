import React, { Component } from "react";
import {connect} from 'react-redux';

import classes from './MessagesInfoContact.module.css';
import Row  from "react-bootstrap/Row";
import Image  from "react-bootstrap/Image";
import Button  from "react-bootstrap/Button";
import InfoBox from '../../../components/UI/InfoBox/InfoBox';
import CustomInput from '../../../components/UI/CustomInput/CustomInput';
import Spinner from '../../../components/UI/Spinner/Spinner';
import noAvatarImg from "../../../assets/no-avatar.jpg";
import * as actions from '../../../store/actions/index';

// Component used to view info about the contact , give him an alias, change the frienship status or remove him. 
class MessagesInfoContact extends Component{
  // State contains the info on which the alias element is rendered via the CustomInput comp
  state = {
    infoContact:{
      alias: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder:"Contact Alias",
          name: "alias",
          id: "alias",
        },
        warning:'At least 1 character required and a maximum of 17',
        subText:'The value that you set for the alias is the one you will see instead of the username for this contact',
        label: "Alias",
        value: "",
        validation: {
          required: true,
          maxLength: 17
        },
        edit:false,
        valid: false,
        changed: false,
      },
    }
  }

  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
  changeInputHandler = (event, elemIdentifier) => {
    let value = event.target.value;

    const updatedInfo = {
      ...this.state.infoContact,
      [elemIdentifier]: {
        ...this.state.infoContact[elemIdentifier],
        value: value,
        valid: this.validationHandler(
          this.state.infoContact[elemIdentifier].validation,
          value
        ),
        changed: true,
      },
    };

    this.setState({ 
      infoContact: updatedInfo
    });
  };

  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
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

    return isValid;
  }

  // Toggle between edit an display mode of alias elem and reset it
  toggleEdit = (name) => {
    this.setState(prevState => {
      return {
        ...this.state,
        infoContact:{
          ...this.state.infoContact,
          [name]:{
            ...this.state.infoContact[name],
            edit: !prevState.infoContact[name].edit,
            changed:false,
            valid:false,
            value:""
          }
        }
      }
    })
  }

  saveChanges = (attribute) => {
    let payload = {};
    payload[attribute] = this.state.infoContact[attribute].value;
   
    this.toggleEdit(attribute);
   
    // For more info check store->actions->alias
    this.props.onChangeAlias(attribute,payload,this.props.selectedId,this.props.info.relation_id,this.props.token);
  }
  
  render(){
    let header = (
      <Row className={['py-3 align-items-center flex-nowrap px-2 mx-0',classes.Header].join(' ')}>
        <i 
          className={["fas fa-times fa-2x ml-2 mr-3 mt-1",classes.Pointer].join(' ')}
          onClick={this.props.backToMain}
        ></i>

        <strong className={classes.HeaderText}>Contact Info</strong>
      </Row>
    );

    // Checking if contact has an image in order to provide the path, if not a path to a no avatar img from assets is provided
    let imagePath = this.props.info.image ? this.props.info.image : noAvatarImg;

    let infoArray = [];

    // Creating an array with the info from redux about the contact in order to render InfoBox comps
    for(let el in this.props.info){
      if(el === 'username' || el === "about" || el === "added_at"){
        infoArray.push({title:el,value:this.props.info[el]});
      }
    }

    let infoItems = infoArray.map(item => {
      return (
        <InfoBox 
          key={`user_${this.props.selectedId}_${item.title}`}
          title={item.title}
          value={item.value}
        />
      )
    });

    const statusArray = ['accepted','blocked','removed'];

    // Depending on the current status of the friendship between the user and contact , buttons are rendered with the option to change it to one of the other 2 options
    let buttons = this.props.info.loading ? (<Spinner size="medium"/>) : statusArray.map(status => {
      if(status === this.props.info.status){
        return null;
      }

      if(status === "accepted" && this.props.info.status === "deleted"){
        return null;
      }

      let buttonText = '';
      let variant = '';
      if(status === "accepted"){
        buttonText = "Unblock";
        variant = "success";
      }else if(status === "blocked"){
        buttonText = "Block";
        variant = "warning";
      }else if(status === "removed"){
        buttonText = "Remove";
        variant = "danger";
      }
      
      // For more info check store->actions->info
      return <Button
              key={`user_${this.props.selectedId}_${buttonText}_button`}
              size="lg"
              variant={variant}
              onClick={this.props.changeFriendshipStatus.bind(this,this.props.info.relation_id,this.props.selectedId,status,this.props.token)}
              block
              >
                {buttonText}
              </Button>;
    });

    let footer = (
      <div className={["d-flex flex-column py-0 my-0 justify-content-space-between",this.props.info.loading ? classes.Loading : ''].join(' ')}>
        {buttons}
      </div>
    );

    let el = this.state.infoContact.alias;

    let body = (
      <div className={["d-flex flex-column py-0",classes.Body].join(' ')}>
        <div className={["d-flex justify-content-center",classes.ImageDiv].join(' ')}>
          <Image src={imagePath} roundedCircle fluid  className=''/>
        </div>

        {infoItems}

        {/* The custom input comp is used to render the alias */}
        <CustomInput 
          key={el.elemConfig.name}
          type="regular"
          editable={true}
          showEdit={true}
          el={el}
          loading={this.props.loadingChangeAlias}
          changeInputHandler={this.changeInputHandler}
          displayValue ={this.props.info[el.elemConfig.name]}
          toggleEdit ={this.toggleEdit}
          saveChanges={this.saveChanges.bind(this,el.elemConfig.name)}
        />

        {footer}
      </div>
    )

    return(
      <div className={classes.MessagesInfoContact}>
        {header}
        {body}
      </div>
    )
  }
}

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loadingChangeAlias: state.info.loadingChangeAlias
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
const mapDispatchToProps = dispatch => {
  return {
   onChangeAlias: (attribute,payload,userId,friendshipId,token) => dispatch(actions.changeAlias(attribute,payload,userId,friendshipId,token))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MessagesInfoContact);