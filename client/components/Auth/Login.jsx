import React, { Component } from 'react';
import API from '../../../config';
import firebase from 'firebase';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { User } from '../../actions/loggedInPerson'
import { Redirect } from 'react-router-dom'
import Home from '../Home/Home'



class Login extends Component {
	constructor(props){
		super(props)

	this.state = { 
		email: '',
		password: ''
	}
	this.createUserHandler = this.createUserHandler.bind(this);
	this.userAuthHandler = this.userAuthHandler.bind(this);
	this.loginChangeHandler = this.loginChangeHandler.bind(this);
	this.loginSubmitHandler = this.loginSubmitHandler.bind(this);
}


	//**********************************AUTH************************************	

 //LOGIN PAGE COMPONENTS
createUserHandler(e) {
	console.log(this.state.email)
	console.log(this.state.password)
	const errHandler = firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
		errHandler.catch((e) => console.log(e.message));
}
userAuthHandler(e) {
	if (e.target.name === 'signin') {
		const errHandler = firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
			errHandler.catch((e) => console.log(e.message));
	} else {
		const errHandler = firebase.auth().signOut();
			errHandler.catch((e) => console.log('e.message'));
	}
}
loginChangeHandler(e) {
	this.setState({
		[e.target.name]: e.target.value
	})
}
loginSubmitHandler(e) {
	if (e.target.name === 'signin' || e.target.name === 'logout') {
		this.userAuthHandler(e);
	} else {
		this.createUserHandler(e);
	}
}
// //END OF LOGIN PAGE COMPONENTS

componentWillMount() {
	//FIREBASE SET UP

	var config = {
		apiKey: API.fireBaseApiKey,
		authDomain: "sotm-66f9b.firebaseapp.com",
		databaseURL: "https://sotm-66f9b.firebaseio.com",
		projectId: "sotm-66f9b",
		storageBucket: "sotm-66f9b.appspot.com",
		messagingSenderId: "1016933819692"
	};
	firebase.initializeApp(config);
// 	//END FIREBASE SET UP
// 	//FIREBASE AUTH
	firebase.auth().onAuthStateChanged((User) => {
		if (User) {
			console.log(User.email, 'logged in!');
			this.props.User(User.email)


		} else {
			console.log('Logged out!');
			this.props.User(null)
		}
	});
}
	
	render() {

		if(this.props.user){
			return (
			// <Redirect to="/home"/>
				<div>
					<Home click={this.loginSubmitHandler} />
				</div>
			)

		}
		
		return (
				<div align="center">
					<input type="email" name="email" placeholder="Email" onChange={this.loginChangeHandler} />
					<br />
					<input type="password" name="password" placeholder="Password" onChange={this.loginChangeHandler} />
					<br />
					<button name="signin" onClick={this.loginSubmitHandler}>Sign In</button><button name="create" onClick={this.loginSubmitHandler}>Create Account</button>
				</div>
			)
	}
}


function mapStateToProps(state) {
	return {
			user: state.activeUser
	};
}
function matchDispatchToProps(dispatch){
	//when selected card is called, passed to all reducers
	return bindActionCreators( { User: User }, dispatch)
}

// conversion from "dumb" component to "container"
export default connect(mapStateToProps, matchDispatchToProps)(Login);
