import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { SignUpLink } from '../SignUp'
import { PasswordForgetLink } from '../PasswordForget'
import { auth, db } from '../../firebase'
import * as routes from '../../constants/routes'
import { getValueByProp } from '../../utils/'
import './style.css'

const SignInPage = ({ history }) =>
    <div className="sign-in-page">
		<div className="left">
			<h3>Войти в чат</h3>
        	<SignInForm history={history} />
		</div>
		<div className="right">
        	<SignInSocial history={history} />
		</div>
		<div className="or">или</div>
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

	render() {
		const { email, password, error } = this.state
		const isInvalid = password === '' || email === ''

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<input
						value={email}
						onChange={event => this.setState(getValueByProp('email', event.target.value))}
						type="text"
						placeholder="Электропочта"
					/>
					<input
						value={password}
						onChange={event => this.setState(getValueByProp('password', event.target.value))}
						type="password"
						placeholder="Пароль"
						pattern="^[a-zA-Z0-9]{6,}"
					/>
					<PasswordForgetLink className="pw-forget-link" />
					<button disabled={isInvalid} type="submit" className="submit-sign-in">Войти</button>

					{ error && <p>{error.message}</p> }
				</form>
        		<SignUpLink className="sign-up-link" />
			</div>
   		)
  	}
}

class SignInSocial extends Component {
	render() {
		return (
			<div className="sign-in-buttons">
				<input 
					type="submit"
					value="Google"
					onClick={this.onClick(auth.providerGoogle)}
					className="social-sign-in google"
				/>
				<input 
					type="submit"
					value="Twitter"
					onClick={this.onClick(auth.providerTwitter)}
					className="social-sign-in twitter"
				/>
				<input 
					type="submit"
					value="Github"
					onClick={this.onClick(auth.providerGithub)}
					className="social-sign-in github"
				/>
			</div>
		)
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
}

export default withRouter(SignInPage)

export {
	SignInForm,
	SignInSocial,
}