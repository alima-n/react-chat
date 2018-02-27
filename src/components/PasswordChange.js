import React, { Component } from 'react'

import { auth } from '../firebase'
import { getValueByProp } from '../utils/'

const INITIAL_STATE = {
	passwordOne: '',
	passwordTwo: '',
	error: null,
}

class PasswordChangeForm extends Component {
	constructor(props) {
		super(props)
		this.state = { ...INITIAL_STATE }
	}

	onSubmit = (event) => {
		const { passwordOne } = this.state

		auth.doPasswordUpdate(passwordOne)
		.then(() => {
			this.setState(() => ({ ...INITIAL_STATE }))
		})
		.catch(error => {
			this.setState(getValueByProp('error', error))
		})

		event.preventDefault()
	}

	render() {
		const {
			passwordOne,
			passwordTwo,
			error,
		} = this.state

		const isInvalid = passwordOne !== passwordTwo

		return (
			<form onSubmit={this.onSubmit}>
				<input
					value={passwordOne}
					onChange={event => this.setState(getValueByProp('passwordOne', event.target.value))}
					type="password"
					placeholder="Новый пароль"
					pattern="^[a-zA-Z0-9]{4,}"
                    required
				/>
				<input
					value={passwordTwo}
					onChange={event => this.setState(getValueByProp('passwordTwo', event.target.value))}
					type="password"
					placeholder="Повторите новый пароль"
					required
				/>
				<button disabled={isInvalid} type="submit">
					Сбросить текущий пароль
				</button>

				{ error && <p>{error.message}</p> }
			</form>
		)
	}
}

export default PasswordChangeForm