import React,{Component} from 'react';
import {connect} from 'react-redux';

import classes from './CreateGroup.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class CreateGroup extends Component {
  // CreateGroup state is used to store the necessary information required to render the fields where the user enters the information required to create a group as well as checking the validity of the entered info.
  state = {
    groupInfo: {
      name: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder: "Enter Group Name",
          name: "name",
          id: "name",
        },
        warning:'At least 1 character required and a maximum of 17',
        subText:'This is the group name which the members will see under the groups tab',
        label: "Group Name",
        value: "",
        validation: {
          required: true,
          maxLength: 17
        },
        valid: false,
        changed: false,
      },
      description:{
        elemType: "textarea",
        elemConfig: {
          name: "description",
          id: "description",
        },
        warning:'Description can\'t have more than 120 characters',
        subText:'Write a short description about the group which will be seen by group members',
        label: "Group Description (optional)",
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
        subText:'Select an image for your group avatar, this is the image that will be seen under the groups tab for this group',
        label: "Select your group image (optional)",
        value: "",
        validation: {
          imageRequirements: true,
        },
        valid: true,
        changed: false,
      }
    },
    isValid:false
  }

  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
  //There is also a check to see if all the fields have valid info. If so the submit button is no longer disabled
  changeInputHandler = (event, elemIdentifier) => {
    let value = elemIdentifier === 'image' ? event.target.files[0] : event.target.value;

    const updatedInfo = {
      ...this.state.groupInfo,
      [elemIdentifier]: {
        ...this.state.groupInfo[elemIdentifier],
        value: value,
        valid: this.validationHandler(
          this.state.groupInfo[elemIdentifier].validation,
          value
        ),
        changed: true,
      },
    };

    let infoIsValid = true;

    for (let elID in updatedInfo) {
      infoIsValid = updatedInfo[elID].valid && infoIsValid;
    }

    this.setState({ 
      groupInfo: updatedInfo, 
      isValid: infoIsValid
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

  // Method used in order to create the group
  createGroupHandler = (event) => {
    event.preventDefault();

    let payload = {};

    // Setting the payload that will be sent to the server
    for(let el in this.state.groupInfo){
      payload[el] = this.state.groupInfo[el].value;
    }

    const resetInfo = {};

    // Resetting the state
    for(let elem in this.state.groupInfo){
      if(elem === 'description' || elem === 'image'){
        resetInfo[elem] = {
          ...this.state.groupInfo[elem],
          value:'',
          changed:false,
          valid:true
        };
      }else{
        resetInfo[elem] = {
          ...this.state.groupInfo[elem],
          value:'',
          changed:false,
          valid:false
        };
      }
    }

    this.setState({groupInfo:resetInfo,isValid:false});

    // For more info check store->actions->info
    this.props.onCreateGroup(payload,this.props.token,this.props.changeActiveInfo,this.props.changeActiveInfoColumn);
  }

  render(){
    let infoArray = [];

    // An array is created with the information from the state in order to render the components that hold the necessary fields
    for(let elem in this.state.groupInfo){
      infoArray.push(this.state.groupInfo[elem]);
    }

    if(this.state.authType === 'login'){
      infoArray = infoArray.filter(el =>el.elemConfig.name==='email' || el.elemConfig.name==='password');
    }

    let groupInfo = infoArray.map(el=>{
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
              <Form.Label className="text-dark">{el.label}</Form.Label>
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
            <Form.Label className="text-dark">{el.label}</Form.Label>
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
      <Form className={["px-3 py-2",this.props.loading ? classes.Loading : null].join(' ')} onSubmit={this.createGroupHandler}>
        {this.props.loading ? <Spinner size="large"/> : (
          <>
            {groupInfo}

            <Button variant="primary" type="submit" className="mt-3" size="lg" block disabled={!this.state.isValid}   >
                Create Group
            </Button>
          </>
        )}
      </Form>
    );

    return (
      <div className={classes.CreateGroup}>
        <div className={classes.Header}>
            <i 
              className={["fas fa-arrow-left mr-4",classes.BackArrow].join(' ')}
              onClick={this.props.changeActiveInfoColumn.bind(this,'infoMain')}></i>
            <strong className="text-light">Create Group</strong>
        </div>

        {form}
      </div>
    )
  };
};

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loading: state.info.loadingCreateGroup
  }
}
// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".

const mapDispatchToProps = dispatch => {
  return {
   onCreateGroup: (payload,token,changeActiveInfo,changeActiveInfoColumn) => dispatch(actions.createGroup(payload,token,changeActiveInfo,changeActiveInfoColumn))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(CreateGroup);
