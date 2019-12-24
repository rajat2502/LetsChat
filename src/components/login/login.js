import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './styles'

class LoginComponent extends Component {

    state = {
        email: '',
        password: '',
        loginError: ''
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmit = e => {

        const { email, password } = this.state;

        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.props.history.push('/dashboard')
            })
            .catch(err => {
                this.setState({
                    loginError: 'Server Error'
                })
            })
    }

    render() {

        const { classes } = this.props;
        const { email, password, loginError } = this.state;

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Log In!</Typography>
                    <form onSubmit={this.handleSubmit} className={classes.form}>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="email">Enter Your Email</InputLabel>
                            <Input autoComplete="email" autoFocus id="email" name="email" value={email} onChange={this.handleChange} />
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="password">Enter Your Password</InputLabel>
                            <Input type="password" id="password" name="password" value={password} onChange={this.handleChange} />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Submit</Button>
                    </form>
                    {
                        loginError ? 
                        <Typography component="h5" variant="h6" className={classes.errorText}>
                            Incorrect Login Information
                        </Typography> :
                        null
                    }
                    <Typography component="h5" variant="h6" className={classes.noAccountHeader}>Don't Have An Account?</Typography>
                    <Link className={classes.signUpLink} to="/signup">Sign Up!</Link>
                </Paper>
            </main>
        )
    }

}

export default withStyles(styles)(LoginComponent);