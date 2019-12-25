import React, { Component } from 'react';

import firebase from 'firebase';

import Button  from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import ChatListComponent from '../chatList/chatList';
import ChatViewComponent from '../chatView/chatView';
import ChatTextBoxComponent from '../chattextbox/chatTextBox';
import NewChatComponent from '../newChat/newChat';

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

    selectChat = async (chatIndex) => {
        await this.setState({
            selectedChat: chatIndex
        })
        this.messageRead();
    }

    signOut = () => firebase.auth().signOut();

    submitMessge = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0])
        firebase 
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            })
    }

    buildDocKey = friend => [this.state.email, friend].sort().join(':');

    clickedChatWhereNotSender = chatIndex => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

    messageRead = () => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
        if(this.clickedChatWhereNotSender(this.state.selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true })
        }
        else {
            console.log('clicked message where the user was the sender');
        }
    }

    goToChat = async (docKey, message) => {
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        this.setState({
            newChatFormVisible: false
        })
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessge(message);
    }

    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);
        await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
                receiverHasRead: false,
                users: [this.state.email, chatObj.sendTo],
                messages: [{
                    message: chatObj.message,
                    sender: this.state.email
                }]
            })
        this.setState({
            newChatFormVisible: false
        })
        this.selectChat(this.state.chats.length - 1);
    } 

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
                {
                    selectedChat !== null && !newChatFormVisible ? 
                    <ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessge} />
                    : null
                }
                {
                    newChatFormVisible ? 
                    <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}  />
                    : null
                }
                <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
            </div>
        )
    }

}

export default withStyles(styles)(DashboardComponent);