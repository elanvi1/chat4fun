import React, { Component } from "react";
import {connect} from 'react-redux';

import classes from './MessagesInfoGroup.module.css';
import Row  from "react-bootstrap/Row";
import Image  from "react-bootstrap/Image";
import Button  from "react-bootstrap/Button";
import InfoBox from '../../../components/UI/InfoBox/InfoBox';
import CustomInput from '../../../components/UI/CustomInput/CustomInput';
import ModalAddContact from '../../../components/Messages/ModalAddContact/ModalAddContact';
import ModalMembers from '../../../components/Messages/ModalMembers/ModalMembers';
import noAvatarGroupImg from "../../../assets/no-avatar-group.png";
import * as actions from '../../../store/actions/index';

// Component used to:
// - display or edit(if permssion allows it) info about the group
// - add contacts to group, 
// - take different actions on group members:
//  - add them to contact list
//  - change permission if users permission allows it
//  - remove from group if permission allows it
// - leave group
// - delete group if permission allows it

class MessagesInfoGroup extends Component{
  // State is used to store info necessary to render CustomInput comps, which have to modes edit and display. The info is only used if user has the necessary permission.
  // State also contains property used for showing the modals with contacts and members
  // State also contains the values which the user enters to search for a contact or member
  // State also contains an object used to handle the dropdown for each member
  state = {
    groupInfo: {
      name: {
        elemType: "input",
        elemConfig: {
          type: "text",
          placeholder:"New Group Name",
          name: "name",
          id: "groupName",
        },
        warning:'At least 1 character required and a maximum of 17',
        subText:'Change the group name to something new',
        label: "Name ",
        value: "",
        validation: {
          required: true,
          maxLength: 17
        },
        edit:false,
        valid: false,
        changed: false,
      },
      description:{
        elemType: "textarea",
        elemConfig: {
          placeholder:"New Description About Group",
          name: "description",
          id: "groupDescription",
        },
        warning:'Description can\'t have more than 120 characters',
        subText:'Write a short description about the group which will be seen by its members',
        label: "Description ",
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
          placeholder:"New Image",
          name: "image",
          id: "groupImage",
          noImgId:"noImageGroup"
        },
        warning:'File must be an image of format jpeg,jpg,png,gif,webp and can\'t have a size greater than 2 MB',
        subText:'Select an image for the group which will be seen by its members',
        label: "Image ",
        value: null,
        validation: {
          imageRequirements: true,
        },
        valid: false,
        changed: false,
      }
    },
    showModalAddContact:false,
    showModalMembers:false,
    searchedValueAddContactToGroup:'',
    searchedValueMember:'',
    dropDownMember:{
      id:0,
      show:false
    }
  }

  // Method triggered by onChange of elements, it copies the value from the  field to the state and checks if the value is valid
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

    // If an image is added, I make sure that the no image checkmark isn't selected
    if(elemIdentifier === 'image'){
      document.getElementById("noImageGroup").checked = false;
    }

    this.setState({ 
      groupInfo: updatedInfo
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

  // Toggles between the 2 modes edit and dispaly and resets the state info for an element
  toggleEdit = (name) => {
    if(name === "image"){
      document.getElementById("groupImage").value = "";
    }

    this.setState(prevState => {
      return {
        ...this.state,
        groupInfo:{
          ...this.state.groupInfo,
          [name]:{
            ...this.state.groupInfo[name],
            edit: !prevState.groupInfo[name].edit,
            changed:false,
            valid:name === "description" ? true : false,
            value:""
          }
        }
       
      }
    })
  }

  // Sets the value to null in the state for the image element along with the value of the dom element. 
  noImageToggle = (e) => {
    document.getElementById("groupImage").value = "";

    this.setState({
      ...this.state,
      groupInfo:{
        ...this.state.groupInfo,
        image:{
          ...this.state.groupInfo.image,
          valid:e.target.checked,
          changed:false,
          value:null
        }
      }
    });
  }

  // Method triggered when saving the changes made by the user to the group, only available if the provided info is valid. 
  saveChanges = (attribute) => {
    let payload = {};

    // Payload sent to the server
    payload[attribute] = this.state.groupInfo[attribute].value
    
    this.toggleEdit(attribute);

    // For more info check store->actions->info
    this.props.onChangeGroupInfo(attribute,payload,this.props.selectedId,this.props.token);
  }

  // Handles the visibility of the Modal that shows the contacts which can be potentially added to the group. 
  toggleModalAddContact = () => {
    this.setState(prevState => {
      return {
        showModalAddContact: !prevState.showModalAddContact,
        searchedValueAddContactToGroup:''
      }
    })
  }

  changeSearchedValueAddContactToGroup = (e) => {
    this.setState({searchedValueAddContactToGroup: e.target.value});
  }

  // Handles the visibility of the modal that shows the members
  toggleModalMembers = () => {
    this.setState(prevState=>{
      return {
        showModalMembers: !prevState.showModalMembers,
        searchedValueMember:'',
        dropDownMember:{
          id:0,
          show:false
        }
      }
    })
  }

  changeSearchedValueMembers = (e) => {
    this.setState({searchedValueMember: e.target.value});
  }

  // Handles the dropdown that contains the actions that can be taken on a member.
  handleClickDropdownMember = (id) => {
    this.setState(prevState => {
      return {
        dropDownMember:{
          id:id,
          show: prevState.dropDownMember.id === id ? !prevState.dropDownMember.show : id === 0 ? false : true
        }
      }
    })
  }

  render(){
    let header = (
      <Row className={['py-3 align-items-center flex-nowrap px-2 mx-0',classes.Header].join(' ')}>
        <i 
          className={["fas fa-times fa-2x ml-2 mr-3 mt-1",classes.Pointer].join(' ')}
          onClick={this.props.backToMain}
        ></i>

        <strong className={classes.HeaderText}>Group Info</strong>
      </Row>
    );

    let imagePath = this.props.info.image ? this.props.info.image : noAvatarGroupImg;
    let hasEditPermission = this.props.info.permission === "Admin" || this.props.info.permission === "Edit";
    let hasAddPermission = this.props.info.permission === "Admin" || this.props.info.permission === "Add/Remove";

    let infoArray = [];
    let infoItems = null;

    // Checking if the user has the necessary permission to edit group info. If he has then CustomInput comps are rendered(where applicable because joined_at and created_at can't be chagne) where the user can change the group info by going in the edit mode. If he hasn't then InfoBox comps are rendered where the information is simply displayed
    if(!hasEditPermission){
      for(let el in this.props.info){
        if(el === 'name' || el === "description" || el === "joined_at" || el === "created_at"){
          infoArray.push({title:el,value:this.props.info[el]});
        }
      }
  
      infoItems = infoArray.map(item => {
        return (
          <InfoBox 
            key={`group_${this.props.selectedId}_${item.title}`}
            title={item.title}
            value={item.value}
          />
        )
      });
    }else{
      for(let el in this.state.groupInfo){
        infoArray.push(this.state.groupInfo[el]);
      }

      infoArray.push('created_at','joined_at');

      infoItems = infoArray.map(el=>{
        if(el === 'created_at' || el === 'joined_at'){
          return (
            <InfoBox 
              key={`group_${this.props.selectedId}_${el}`}
              title={el}
              value={this.props.info[el]}
            />
          )
        }

        if(el.elemConfig.type === 'file'){
          return (
            <CustomInput
              key={el.elemConfig.id}
              type="file"
              el={el}
              loading={this.props.loading[el.elemConfig.name]}
              hasImage={this.props.info.image}
              changeInputHandler={this.changeInputHandler}
              noImageToggle={this.noImageToggle}
              saveChanges={this.saveChanges.bind(this,el.elemConfig.name)}
            />
          )
        }else {
          return (
            <CustomInput 
              key={el.elemConfig.id}
              type="regular"
              editable={true}
              showEdit={true}
              el={el}
              loading={this.props.loading[el.elemConfig.name]}
              changeInputHandler={this.changeInputHandler}
              displayValue ={this.props.info[el.elemConfig.name]}
              toggleEdit ={this.toggleEdit}
              saveChanges={this.saveChanges.bind(this,el.elemConfig.name)}
            />
          )
        }
      });
    }

    // Creating the button that shows the modal with the contacts that can be added to the group
    let addContactButton = hasAddPermission ? (
      <Button 
        variant="light"
        className="text-left"
        size="lg"
        block
        onClick={this.toggleModalAddContact}
      >
        <i className="fas fa-user-plus fa-2x text-success mr-4"></i>
        <strong className={[classes.TextModalButton,'align-top'].join(' ')}>Add Contact</strong>
      </Button>
    ): null;

    // Modal with the contacts that can be added to the group
    let addContactModal = hasAddPermission ? (
      <ModalAddContact 
        groupInfo={this.props.info}
        contacts={this.props.contacts}
        loading={this.props.loadingAddContactToGroup}
        show={this.state.showModalAddContact}
        searchedValue={this.state.searchedValueAddContactToGroup}
        addContactToGroup={this.props.onAddContactToGroup.bind(this,this.props.token,this.props.info.group_id)}
        toggleModal={this.toggleModalAddContact}
        changeSearchedValue={this.changeSearchedValueAddContactToGroup}
      />
    ): null;

    // Creating the button that shows the modal with the members of the group
    let membersButton = (
      <Button 
        variant="light"
        className="text-left text-info"
        size="lg"
        block
        onClick={this.toggleModalMembers}
      >
        <i className="fas fa-users fa-2x  mr-4"></i>
        <strong className={[classes.TextModalButton,'text-info align-top'].join(' ')}>Members</strong>
      </Button>
    );

    // Modal with the members of the group
    let membersModal = (
      <ModalMembers
        show={this.state.showModalMembers} 
        mainUserId={this.props.mainUserId}
        contacts={this.props.contacts}
        groupInfo={this.props.info}
        searchedValue={this.state.searchedValueMember}
        dropDown={this.state.dropDownMember}
        loading={this.props.loadingMembersAction}
        userIdsPendingFriendships={this.props.userIdsPendingFriendships}
        clickDropdown={this.handleClickDropdownMember}
        toggleModal={this.toggleModalMembers}
        changeSearchedValue={this.changeSearchedValueMembers}
        sendFriendshipRequest={this.props.onSendFriendshipRequest.bind(this,this.props.token,null,null)}
        removeMember={this.props.onRemoveGroupMember.bind(this,this.props.token,this.props.info.group_id)}
        updatePermission={this.props.onUpdatePermissionGroupMember.bind(this,this.props.token,this.props.info.group_id)}
      />
    );

    // For more info check store->actions->info
    let leaveGroupButton = (
      <Button 
        variant="warning"
        className="text-center"
        size="lg"
        block
        onClick={this.props.leaveGroup.bind(this,this.props.token,this.props.mainUserId,this.props.selectedId)}
      >
        Leave Group
      </Button>
    );

    let deleteGroupButton = this.props.info.permission === "Admin" ? (
      <Button 
        variant="danger"
        className="text-center"
        size="lg"
        block
        onClick={this.props.deleteGroup.bind(this,this.props.token,this.props.selectedId)}
      >
        Delete Group
      </Button>
    ) : null;
    

    let body = (
      <div className={["d-flex flex-column py-0",classes.Body].join(' ')}>
        <div className={["d-flex justify-content-center",classes.ImageDiv].join(' ')}>
          <Image src={imagePath} roundedCircle fluid  className=''/>
        </div>

        {infoItems}

        {addContactButton}

        {membersButton}

        {addContactModal}

        {membersModal}

        {leaveGroupButton}

        {deleteGroupButton}
      </div>
    );

    return (
      <div className={classes.MessagesInfoGroup}>
        {header}
        {body}
        
      </div>
    );
  };
};

// This is the state from redux which is passed to the component via the connect method as a prop
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    mainUserId: parseInt(state.auth.userId),
    userIdsPendingFriendships: state.info.userIdsPendingFriendships,
    loading: state.info.loadingGroupInfo,
    loadingAddContactToGroup: state.info.loadingAddContactToGroup,
    loadingMembersAction: state.info.loadingMembersAction
  }
}

// This are the functions that are used to dispatch actions in redux via the connect method as a prop.
// Each function that is used to dispatch an action has the same name as the action in the store with the addition of the prefix "on". So if you see "For more info check store->actions->..." above a function that starts with "on" you find the action that is dispatched in that file and has the name of the function minus "on".
const mapDispatchToProps = dispatch => {
  return {
   onChangeGroupInfo: (attribute,payload,groupId,token) => dispatch(actions.changeGroupInfo(attribute,payload,groupId,token)),

   onAddContactToGroup: (token,groupId,contact) => dispatch(actions.addContactToGroup(token,groupId,contact)),

   onSendFriendshipRequest: (token,resetSearchedValue,changeActiveInfoColumn,friendId,fromGroup) => dispatch(actions.sendFriendshipRequest(token,resetSearchedValue,changeActiveInfoColumn,friendId,fromGroup)),

   onRemoveGroupMember: (token,groupId,userId) => dispatch(actions.removeGroupMember(token,groupId,userId)),

   onUpdatePermissionGroupMember: (token,groupId,permission,userId) => dispatch(actions.updatePermissionGroupMember(token,groupId,permission,userId))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MessagesInfoGroup);
