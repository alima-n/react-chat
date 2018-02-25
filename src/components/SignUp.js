import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import * as routes from '../constants/routes'
import getValueByProp from '../utils/getValueByProp'
import { auth, db } from '../firebase'


const SignUpPage = ({ history }) =>
    <div>
        <h1>SignUp</h1>
        <SignUpForm history={history} />
    </div>

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
}

class SignUpForm extends Component {
    constructor(props) {
        super(props)
        this.state = { ...INITIAL_STATE }
    }

    onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
        } = this.state

        const { history } = this.props
      
        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {

                const photoURL = `https://api.adorable.io/avatars/100/${authUser.uid}.png`

                db.doCreateUser(authUser.uid, username, email, photoURL)
                .then(() => {
                    auth.doUpdateUsername(username)
                    auth.doUpdateAvatar(photoURL)
                    history.push(routes.HOME)
                    this.setState(() => ({ ...INITIAL_STATE }))
                })
                .catch(error => {
                  this.setState(getValueByProp('error', error));
                })
            })
            .catch(error => {
              this.setState(getValueByProp('error', error));
            })

        event.preventDefault()
    }

    render() {
        const {
                username,
                email,
                passwordOne,
                passwordTwo,
                error,
        } = this.state

        const isInvalid = passwordOne !== passwordTwo

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    value={username}
                    onChange={event => this.setState(getValueByProp('username', event.target.value))}
                    type="text"
                    placeholder="Full Name"
                    required
                />
                <input
                    value={email}
                    onChange={event => this.setState(getValueByProp('email', event.target.value))}
                    type="email"
                    placeholder="Email Address"
                    required
                />
                <input
                    value={passwordOne}
                    onChange={event => this.setState(getValueByProp('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Password"
                    pattern="^[a-zA-Z0-9]{4,}"
                    required
                />
                <input
                    value={passwordTwo}
                    onChange={event => this.setState(getValueByProp('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit" disabled={isInvalid}>Sign Up</button>

                { error && <p>{error.message}</p> }
                
            </form>
        )
    }
}

const SignUpLink = () =>
    <p>
        Don't have an account?
        {' '}
        <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
}