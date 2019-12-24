import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import LoginComponent from './components/login/login';
import SignUpComponent from './components/signup/signup';
import DashboardComponent from './components/dashboard/dashboard';

firebase.initializeApp({
    apiKey: "AIzaSyA5Vcftt727t0-JriWX7HjM_NDuuPqAPcE",
    authDomain: "react-chatapp-3d037.firebaseapp.com",
    databaseURL: "https://react-chatapp-3d037.firebaseio.com",
    projectId: "react-chatapp-3d037",
    storageBucket: "react-chatapp-3d037.appspot.com",
    messagingSenderId: "1068214292747",
    appId: "1:1068214292747:web:bd2ef859a40a4ff51cd20e",
    measurementId: "G-LSVC9778QN"
});

const routing = (
    <Router>
        <Switch>
            <Route path="/" exact component={LoginComponent} />
            <Route path="/signup" component={SignUpComponent} />
            <Route path="/dashboard" component={DashboardComponent} />
        </Switch>
    </Router>
)

ReactDOM.render( routing, document.getElementById('root'));