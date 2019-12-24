import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from  '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from'@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './styles';

class SignUpComponent extends Component {

    state = {
        email: '',
        password1: '',
        password2: '',
        signupError: ''
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    formIsValid = () => this.state.password1 === this.state.password2;

    handleSubmit = e => {

        const { email, password1 } = this.state;

        e.preventDefault();
        if(!this.formIsValid()){
            this.setState({
                signupError: 'Passwords do not match!'
            })
            return;
        }
        
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password1)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email
                }
                firebase
                    .firestore()
                    .collection('users')
                    .doc(email)
                    .set(userObj)
                    .then(() => {
                        this.props.history.push('/dashboard')
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({
                            signupError: err.message
                        })
                    })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    signupError: err.message
                })
            })
    }

    render() {

        const { classes } = this.props;
        const { email, password1, password2, signupError } = this.state;

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Sign Up!
                    </Typography>
                    <form onSubmit={this.handleSubmit} className={classes.form}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='email'>Enter Your Email</InputLabel>
                            <Input autoComplete='email' autoFocus id='email' name="email" value={email} onChange={this.handleChange} />
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor="password1">Create Your Password</InputLabel>
                            <Input type="password" id="password1" name="password1" value={password1} onChange={this.handleChange} />
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor="password2">Confirm Your Password</InputLabel>
                            <Input type="password" id="password2" name="password2" value={password2} onChange={this.handleChange} />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Submit</Button>
                    </form>
                    {
                        signupError ?
                        <Typography component="h5" variant="h6" className={classes.errorText}>{signupError}</Typography> :
                        null
                    }
                    <Typography component="h5" variant="h6" className={classes.hasAccountHeader}>Already Have An Account?</Typography>
                    <Link to="/" className={classes.logInLink}>Log In!</Link>
                </Paper>
            </main>
        )
    }

}

export default withStyles(styles)(SignUpComponent);