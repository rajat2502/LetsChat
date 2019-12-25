import React, { Component } from 'react';

import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';

import styles from './styles';
import firebase from 'firebase';

class NewChatComponent extends Component {

    state = {
        friendEmail: '',
        message: ''
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    submitNewChat = async e => {
        e.preventDefault();
        const userExists = await this.userExists();
        if(userExists) {
            const chatExists = await this.chatExists();
            chatExists ? this.goToChat() : this.createChat();
        }
    }

    createChat = () => {
        this.props.newChatSubmitFn({
            sendTo: this.state.friendEmail,
            message: this.state.message
        })
    }

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

    buildDocKey = () => {
        return [firebase.auth().currentUser.email, this.state.friendEmail].sort().join(':');
    }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .get();
        console.log(chat.exists);
        return chat.exists;
    }

    userExists = async () => {
        const userSnapshot = await firebase
            .firestore()
            .collection('users')
            .get()
        const exists = userSnapshot.docs
            .map(_doc => _doc.data().email)
            .includes(this.state.friendEmail)
        // this.setState({ 
        //     serverError: !exists
        //  })
        return exists;
    }
    
    render() {

        const { classes } = this.props;
        const { friendEmail, message } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5" style={{ textAlign: 'center' }}>Send a Message!</Typography>
                    <form className={classes.form} onSubmit={this.submitNewChat}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="new-chat-username">
                                Enter Your Friend's Email
                            </InputLabel>
                            <Input 
                                required
                                autoFocus
                                onChange={this.handleChange}
                                name="friendEmail"
                                value={friendEmail}
                                id="new-chat-username"
                                className={classes.input} />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="new-chat-message">
                                Enter Your Message
                            </InputLabel>
                            <Input 
                                required
                                onChange={this.handleChange}
                                name="message"
                                value={message}
                                id="new-chat-message"
                                className={classes.input} />
                        </FormControl>
                        <Button type="submit" className={classes.submit} fullWidth variant="contained" color="primary">Submit</Button>
                    </form>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(NewChatComponent);