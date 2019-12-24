import React, { Component, Fragment } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatListComponent extends Component {

    newChat = () => {
        console.log('new chat click');
    }

    selectChat = (index) => {
        console.log(index);
    }

    render() {

        const { classes, chats, selectedChatIndex, userEmail } = this.props;

        if(chats.length > 0) {
            return (
                <main className={classes.root}>
                        <Button 
                            variant='contained'
                            color='primary'
                            fullWidth
                            className={classes.newChatBtn}
                            onClick={this.newChat}
                        >
                            New Chat
                        </Button>
                        <List>
                            {
                                chats.map((_chat, _index) => {
                                    return (
                                        <div key={_index}>
                                            <ListItem 
                                            onClick={() => this.selectChat(_index)}
                                            className={classes.ListItem}
                                            selected={selectedChatIndex === _index}
                                            alignItems="flex-start"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy sharp">{_chat.users.filter(_user => _user !== userEmail)[0].split('')[0]}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={_chat.users.filter(_user => _user !== userEmail)[0]}
                                                    secondary={
                                                        <Fragment>
                                                            <Typography component='span' color="textPrimary">
                                                                {
                                                                    _chat.messages[_chat.messages.length-1].message.substring(0, 30)
                                                                }
                                                            </Typography>
                                                        </Fragment>
                                                    }
                                                >
                                                </ListItemText>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    )
                                })
                            }
                        </List>
                    </main>
                )
        }

        else {
            return (
                <main className={classes.root}>
                    <Button 
                        variant='contained'
                        color='primary'
                        fullWidth
                        className={classes.newChatBtn}
                        onClick={this.newChat}>
                    New Chat
                    </Button>
                    <List></List>
                </main>
            )
        }
    }
}

export default withStyles(styles)(ChatListComponent);