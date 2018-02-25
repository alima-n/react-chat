import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { SignUpLink } from './SignUp'
import { PasswordForgetLink } from './PasswordForget'
import { auth, db } from '../firebase'
import * as routes from '../constants/routes'
import getValueByProp from '../utils/getValueByProp'


const SignInPage = ({ history }) =>
    <div>
        <h1>Sign In</h1>
        <SignInForm history={history} />
		<PasswordForgetLink />
        <SignUpLink />
    </div>

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
}

class SignInForm extends Component {
 	 constructor(props) {
		super(props)
		this.state = { ...INITIAL_STATE };
  	}

	onSubmit = (event) => {
		const { email, password } = this.state;

    	const { history } = this.props

    	auth.doSignInWithEmailAndPassword(email, password)
		.then(() => {
			this.setState(() => ({ ...INITIAL_STATE }));
			history.push(routes.HOME)
		})
		.catch(error => {
			this.setState(getValueByProp('error', error))
		})
		
    	event.preventDefault()
	}

	onClick = (provider) => (event) => {
		const { history } = this.props	
		auth.doSignInWithProvider(provider)
		.then((result) => {
			const user = result.user;
			db.doCreateUser(user.uid, user.displayName, user.email, user.photoURL)
			.then(() => {
				history.push(routes.HOME)
			})
		})
		.catch((error) => {
			this.setState(getValueByProp('error', error))
		})

		event.preventDefault()
	}

	render() {
		const {
			email,
			password,
			error,
		} = this.state

		const isInvalid = password === '' || email === ''

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<input
						value={email}
						onChange={event => this.setState(getValueByProp('email', event.target.value))}
						type="text"
						placeholder="Email Address"
						required
					/>
					<input
						value={password}
						onChange={event => this.setState(getValueByProp('password', event.target.value))}
						type="password"
						placeholder="Password"
						pattern="^[a-zA-Z0-9]{4,}"
						required
					/>
					<button disabled={isInvalid} type="submit">Sign In</button>

					{ error && <p>{error.message}</p> }
				</form>
				<input 
					type="submit"
					value="Google"
					onClick={this.onClick(auth.providerGoogle)}
				/>
				<input 
					type="submit"
					value="Twitter"
					onClick={this.onClick(auth.providerTwitter)}
				/>
				<input 
					type="submit"
					value="Github"
					onClick={this.onClick(auth.providerGithub)}
				/>
			</div>
   		)
  	}
}

export default withRouter(SignInPage)

export {
    SignInForm,
}