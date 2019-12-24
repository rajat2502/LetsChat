import React, { Component } from 'react';

import firebase from 'firebase';

import ChatListComponent from '../chatList/chatList';

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
        console.log(chatIndex);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr){
                this.props.history.push('/login');
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
            </div>
        )
    }

}

export default DashboardComponent;