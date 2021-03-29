import React, { Component } from "react";
import {connect} from 'react-redux';

import classes from "./Authenticate.module.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import * as actions from '../../store/actions/index';    

class Authenticate extends Component{
  // Authenticate state is used to create the different fields required to login/register. In here the validity of each value that the user inputs is also being kept track of. 

  state = {
    userInfo: {
      name: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder: "Enter Name",
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
        valid: false,
        changed: false,
      },
      username: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder: "Enter Username",
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
        valid: false,
        changed: false,
      },
      email: {
        elemType: "input",
        elemConfig: {
          type: "email",
          placeholder: "Enter Email",
          name: "email",
          id: "email",
        },
        warning:'Needs to have format ...@...[.]...',
        subText:'We\'ll never share your email with anyone else',
        label: "Email",
        value: "",
        validation: {
          required: true,
          isEmail: true,
          maxLength: 189
        },
        valid: false,
        changed: false,
      },
      about:{
        elemType: "textarea",
        elemConfig: {
          name: "about",
          id: "about",
        },
        warning:'Description can\'t have more than 120 characters',
        subText:'Write a short description about yourself which will be seen by other users',
        label: "About (optional)",
        value: "",
        validation: {
          maxLength: 120
        },
        valid: true,
        changed: false,
      },
      image:{
        elemType: "input",
        elemConfig: {
          type:'file',
          name: "image",
          id: "image",
        },
        warning:'File must be an image of format jpeg,jpg,png,gif,webp and can\'t have a size greater than 2 MB',
        subText:'Select an image for your avatar',
        label: "Select your Avatar (optional)",
        value: "",
        validation: {
          imageRequirements: true,
        },
        valid: true,
        changed: false,
      },
      password: {
        elemType: "input",
        elemConfig: {
          type: "password",
          placeholder: "Enter your password",
          name: "password",
          id: "password",
        },
        warning:'Needs to have at least 6 characters and a maximum of 189',
        subText:'We\'ll never share your password with anyone else',
        label: "Password",
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 189
        },
        valid: false,
        changed: false,
      },
      password_confirmation: {
        elemType: "input",
        elemConfig: {
          type: "password",
          placeholder: "Confirm your password",
          name: "password_confirmation",
          id: "password_confirmation",
        },
        warning:'Needs to have at least 6 characters and a maximum of 189',
        label: "Password",
        value: "",
        validation: {
          required: true,
          minLength: 6,
          maxLength: 189
        },
        valid: false,
        changed: false,
      },
    },
    authType:'login',
    passwordsMatch:false,
    isValid:false,
  }

  // This method is used to toggle between login and register. In the front end the difference is that in login only the email and password fields are required to fill.

  toggleAuthType = () => {
    this.setState(prevState => {
      return {
        authType: prevState.authType === 'login' ? 'register' : 'login'
      }
    });
  }

  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
  //There is also a check to see if all the fields have valid info. If so the submit button is no longer disabled
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

    let infoIsValid = true;

    for (let elID in updatedInfo) {
      if(this.state.authType === 'login'){
        if(elID === 'email' || elID ==='password'){
          infoIsValid = updatedInfo[elID].valid && infoIsValid;
        }
      }else{
        infoIsValid = updatedInfo[elID].valid && infoIsValid;
      }
    }

    let passwordsMatch = false;
    
    if(this.state.authType === 'register'){
       passwordsMatch = updatedInfo.password.valid && updatedInfo.password.value === updatedInfo.password_confirmation.value;
    }

    this.setState({ 
      userInfo: updatedInfo, 
      isValid: this.state.authType === 'login' ? infoIsValid : infoIsValid && passwordsMatch,
      passwordsMatch: passwordsMatch
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
      isValid = pattern.test(value) && isValid;
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

  // Method used when the user logs in or registers
  authHandler = event => {
    event.preventDefault();

    let payload = {};

    // Depending on the type of auth, login or register, a different payload is sent to the server
    if(this.state.authType === 'login'){
      payload['device_name'] = navigator.userAgent;
    }

    for(let el in this.state.userInfo){
      if(this.state.authType === 'login'){
        if(el === 'email' || el === 'password'){
          payload[el] = this.state.userInfo[el].value;
        }
      }

      payload[el] = this.state.userInfo[el].value;
    }

    const resetInfo = {};

    // All the information about each field is reset
    for(let elem in this.state.userInfo){
      if(elem === 'about' || elem === 'image'){
        resetInfo[elem] = {
          ...this.state.userInfo[elem],
          value:'',
          changed:false,
          valid:true
        };
      }else{
        resetInfo[elem] = {
          ...this.state.userInfo[elem],
          value:'',
          changed:false,
          valid:false
        };
      }
    }

    this.setState({userInfo:resetInfo,isValid:false,passwordsMatch:false});

    // For more info about what each function does check store->actions->auth
    if(this.state.authType === 'login'){
      this.props.onLogin(payload);
    }else if(this.state.authType === 'register'){
      this.props.onRegister(payload);
    }
  }

  render(){

    let infoArray = [];

    // An array is being created with all the necessary info from state in order to render the components necessary for login/register
    for(let elem in this.state.userInfo){
      infoArray.push(this.state.userInfo[elem]);
    }

    if(this.state.authType === 'login'){
      infoArray = infoArray.filter(el =>el.elemConfig.name==='email' || el.elemConfig.name==='password');
    }

    let userInfo = infoArray.map(el=>{
      if(el.elemType === 'input'){
        if(el.elemConfig.type === 'file'){
          return (
            <Form.Group key={el.elemConfig.name}>
              <Form.File  
                id={el.elemConfig.id}
                name={el.elemConfig.name}
                label={el.label}
                onChange={event => this.changeInputHandler(event,el.elemConfig.name)}
                custom/>
              <Form.Text className={!el.valid && el.changed ? 'text-danger':'text-muted'}>
                {!el.valid && el.changed ? el.warning : el.subText}
              </Form.Text>
            </Form.Group>
          )
        }else {
          return (
            <Form.Group controlId={el.elemConfig.id} key={el.elemConfig.name}>
              <Form.Label className="text-light">{el.label}</Form.Label>
              <Form.Control type={el.elemConfig.type} placeholder={el.elemConfig.placeholder} name={el.elemConfig.name} onChange={event => this.changeInputHandler(event,el.elemConfig.name)} value={el.value}/>
              <Form.Text className={!el.valid && el.changed ? 'text-danger':'text-muted'}>
                {!el.valid && el.changed ? el.warning : el.subText}
              </Form.Text>
            </Form.Group>
          )
        }
      }else if(el.elemType === 'textarea'){
        return (
          <Form.Group controlId={el.elemConfig.name} key={el.elemConfig.name}>
            <Form.Label className="text-light">{el.label}</Form.Label>
            <Form.Control as={el.elemType} rows={3} name={el.elemConfig.name} onChange={event => this.changeInputHandler(event,el.elemConfig.name)} value={el.value}/>
            <Form.Text className={!el.valid && el.changed ? 'text-danger':'text-muted'}>
              {!el.valid && el.changed ? el.warning : el.subText}
            </Form.Text>
          </Form.Group>
        )
      }

      return 'The specified element couldn\'t be found';
    });

    let form = (
      <Form className="bg-dark px-3 py-2" onSubmit={this.authHandler}>
        <h1 className="text-center text-light">{this.state.authType === 'login' ? 'Login' : 'Register'}</h1>

        {userInfo}

        {this.state.authType === 'register' && this.state.userInfo.password.valid && this.state.userInfo.password_confirmation.valid && this.state.userInfo.password_confirmation.changed && !this.state.passwordsMatch ? (
          <Alert variant='danger'>
            Passwords don't match
          </Alert>
        ): null}

        <Button variant="primary" type="submit" className="mt-3" size="lg" block disabled={!this.state.isValid}   >
            {this.state.authType === 'login' ? 'Login' : 'Register'}
        </Button>

        {this.props.token ? (
          <Button variant="danger"  className="mt-3" size="lg" block onClick={this.props.onLogout.bind(this,this.props.token)}>
            Logout
          </Button>
        ): null}

        <Form.Text className="text-muted">
          { this.state.authType === 'register' ?
            'Already have an account? Log in ' :
            'Don\'t have an account? You can register '
          }
          <em onClick={this.toggleAuthType} className={classes.ChangeAuthType}>here</em>
        </Form.Text>
      </Form>
    );

    return (
      <Container className={classes.Authenticate}>
        {form}
      </Container>
    )
  }
}

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
const mapDispatchToProps = dispatch => {
  return {
    onLogin: (payload) => dispatch(actions.login(payload)),
    onRegister: (payload) => dispatch(actions.register(payload)),
    onLogout: (token) => dispatch(actions.logoutFromApp(token))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Authenticate);