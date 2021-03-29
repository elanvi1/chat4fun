import React,{Component} from 'react';
import {connect} from 'react-redux';
import classes from './App.module.css';

import Authenticate from './containers/Authenticate/Authenticate';
import Main from './containers/Main/Main';
import Alert from "react-bootstrap/Alert";
import { Ball } from "react-loading-io";
import * as actions from './store/actions/index';

class App extends Component{
 
  componentDidMount(){
    this.props.onAuthCheckState();
  }


  render(){
    return (
      <div 
        onClick={e => {e.stopPropagation()}} 
      >
        <div className={classes.Block1}></div>
        <div className={classes.Block2}></div>

        {/* If any respnse from the backend returns an error then it will be shown at the top of the page*/}
        {this.props.error.message ? 
          <Alert 
            style={{zIndex:'1999'}}
            variant='danger' 
            className={['text-center',classes.MessageAndError].join(' ')} 
            onClick={this.props.onRemoveError}>
              {this.props.error.message}{this.props.error.other ? <em onClick={this.props.onHandleLogInErrorLinks} style={{cursor:'pointer',textDecoration:'underline'}}>here</em> : null} (click to dismiss)
          </Alert> 
        : null}

          {/* If the request from the backend returns a message then it will be shown at the top of the page*/}
        {this.props.message ? 
          <Alert 
            variant='success' 
            className={['text-center',classes.MessageAndError].join(' ')} 
            onClick={this.props.onRemoveMessage}>
              {this.props.message} (click to dismiss)
          </Alert> 
        : null}
        
        {/* While the app is loading(waiting to retrieve the necessary info) an animation is shown. If the user is authenticated then he will enter the app, if not he will be shown the authenticate comp */}
        {this.props.loading ? (
          <div className='d-flex justify-content-center align-items-center' style={{height:'100vh'}}>
            <Ball size={200} color='#0099ff' speed={1.60}/>
            <Ball size={200} color='#FDBB4C' speed={1.60}/>
            <Ball size={200} color='#E70202' speed={1.60}/>
            <Ball size={200} color='#88B47D' speed={1.60}/>
          </div> 
        ) : this.props.token ? <Main/> : <Authenticate/>}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.app.loading,
    error: state.app.error,
    message:state.app.message,
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRemoveError: () => dispatch(actions.removeErrorMessage()),
    onRemoveMessage: () => dispatch(actions.removeMessage()),
    onHandleLogInErrorLinks: ()=>dispatch(actions.handleLogInErrorLinks()),
    onAuthCheckState: ()=>dispatch(actions.authCheckState())
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(App);
