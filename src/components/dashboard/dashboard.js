import React, { Component } from 'react';

import firebase from 'firebase';

import Button  from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import ChatListComponent from '../chatList/chatList';
import ChatViewComponent from '../chatView/chatView';

import styles from './styles';

class DashboardComponent extends Component {

    state = {
        selectedChat: null,
        newChatFormVisible: false,
        email: null,
        chats: []
    }

    newChatBtnClicked = () => {
        this.setState({
            newChatFormVisible: true,
            selectedChat: null
        })
    }

    selectChat = (chatIndex) => {
        this.setState({
            selectedChat: chatIndex
        })
    }

    signOut = () => firebase.auth().signOut();

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr){
                this.props.history.push('/');
            }
            else {
                await firebase  
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _usr.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data())
                        await this.setState({
                            email: _usr.email,
                            chats: chats
                        });
                        console.log(this.state)
                    })
            }
        })
    }

    render() {

        const { selectedChat, newChatFormVisible, email, chats } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <ChatListComponent 
                    history={this.props.histroy}
                    newChatBtnFn={this.newChatBtnClicked}
                    selectChatFn={this.selectChat}
                    chats={chats}
                    userEmail={email}
                    selectedChatIndex={selectedChat}
                />
                {
                    newChatFormVisible ? 
                    null :
                    <ChatViewComponent user={email} chat={chats[selectedChat]} />
                }
                <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
            </div>
        )
    }

}

export default withStyles(styles)(DashboardComponent);