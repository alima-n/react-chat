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
			<div className={this.props.className}>
				<form onSubmit={this.onSubmit}>
					<span>Изменить пароль</span>
					<input
						value={this.state.email}
						onChange={event => this.setState({ email: event.target.value })}
						type="email"
						placeholder="Адрес электропочты"
					/>
					<button type="submit">Отправить</button>
					{ mailSent && <span>Ссылка для смены пароля отправлена на адрес {this.state.email}</span> }
					{ error && <p>{error.message}</p> }
				</form>
			</div>
		)
	}
}

const PasswordForgetLink = (props) =>
	<p className={props.className}>
		<Link to="/pw-forget">Забыли пароль?</Link>
	</p>

export default PasswordForgetPage

export {
    PasswordForgetForm,
    PasswordForgetLink,
}