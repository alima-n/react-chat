import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { auth } from '../firebase'

const PasswordForgetPage = () =>
	<div>
		<h3>Борьба со склерозом</h3>
		<PasswordForgetForm />
	</div>

const INITIAL_STATE = {
	email: '',
	error: null,
	mailSent: false
}

class PasswordForgetForm extends Component {
	constructor(props) {
		super(props)
		this.state = { ...INITIAL_STATE }
	}

	onSubmit = (event) => {
		const { email } = this.state

		auth.doPasswordReset(email)
		.then(() => {
			this.setState({
				email: '', 
				error: null,
				mailSent: true
			})
		})
		.catch(error => {
			this.setState({
				error,
				mailSent: false
			})
		})

		event.preventDefault()
	}

	render() {
		const { error, mailSent } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<input
					value={this.state.email}
					onChange={event => this.setState({ email: event.target.value })}
					type="email"
					placeholder="Email"
					required
				/>
				<button type="submit">
					Сменить пароль
				</button>
				{ mailSent && <p>Письмо для смены пароля отправлено</p> }
				{ error && <p>{error.message}</p> }
			</form>
		)
	}
}

const PasswordForgetLink = () =>
	<p>
		<Link to="/pw-forget">Забыли пароль?</Link>
	</p>

export default PasswordForgetPage

export {
    PasswordForgetForm,
    PasswordForgetLink,
}