import '../Login.css';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {gapi} from 'gapi-script';
import React, {useState, useEffect} from 'react';
import NameForm from '../Form';



import firebase from 'firebase/compat/app';
import { initializeApp} from 'firebase/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

var firebaseConfig = {
  apiKey: "AIzaSyDcqMSqs0hAtKX4_7NHDMEabNkcKXDhnFo",
  authDomain: "dabble-c024e.firebaseapp.com",
  projectId: "dabble-c024e",
  storageBucket: "dabble-c024e.appspot.com",
  messagingSenderId: "1009792798284",
  appId: "1:1009792798284:web:8ac49fa0fbd8cba43c2ee9",
  measurementId: "G-85JSPP996L"
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore()


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: null
    }
    this.clientId = '1009792798284-51ghq4cjo0nfl1icv3edui7b51arbfo9.apps.googleusercontent.com'
    const initClient = () => {
      gapi.client.init({
      clientId:this.clientId,
      scope:' '
      })
    }
    gapi.load('client:auth2', initClient)
    this.onFailure = this.onFailure.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  onSuccess(res)  {
    const profile = res.profileObj;
    const usersRef = db.collection('users').doc(profile.email)

    usersRef.get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          usersRef.set({
            email: profile.email,
            name: profile.name
          }) // create the document
        } else {
          console.log("This user has already been created")
        }
        this.setState({profile: res.profileObj});
    });
  }
  onFailure  (err)  {
    console.log("failed", err)
  }
  logOut() {
    this.setState({profile:null});
  }


  render() {return (
    <div className="Login">
      <header className="Login-header">
        <h1>Dabble</h1>
        <br />
        <br />
        {this.state.profile ? (
          <div>
            <img src={this.state.profile.image} alt="user image"/>
            <p>Name: {this.state.profile.name}</p>
            <p>Email Address: {this.state.profile.email}</p>
            <br />
            <br />
            <GoogleLogout
              clientId={this.clientId}
              buttonText="Log Out"
              onLogoutSuccess={this.logOut}
              />
          </div>
        ) : (
            <GoogleLogin
              clientId = {this.clientId}
              buttonText="Sign in with Google"
              onSuccess={this.onSuccess}
              onFailure={this.onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
        )}  
        <button class="button">Create Task</button>
      </header> 
    </div>
  );}
}
export default Login;
