import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Send from '@material-ui/icons/Send';

import styles from './styles';

class ChatTextboxComponent extends Component {

    state = {
        chatText: ''
    }

    userTyping = e => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

    messageValid = (txt) => txt && txt.replace(/\s/g, '').length;
    
    userClickedInput = () => this.props.messageReadFn();

    submitMessage = () => {
        if(this.messageValid(this.state.chatText)) {
            this.props.submitMessageFn(this.state.chatText);
            document.getElementById("chattextbox").value = '';
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.chatTextBoxContainer}>
                <TextField 
                    placeholder="Type your message..." 
                    onKeyUp={this.userTyping} 
                    id="chattextbox"
                    className={classes.chatTextBox}
                    onFocus={this.userClickedInput}>
                </TextField>
                <Send onClick={this.submitMessage} className={classes.sendBtn} />
            </div>
        )
    }
}

export default withStyles(styles)(ChatTextboxComponent);