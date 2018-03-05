import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import * as routes from '../../constants/routes'
import { getValueByProp } from '../../utils'
import { auth, db } from '../../firebase'
import './style.css'


const SignUpPage = ({ history }) =>
    <div className="sign-up-block">
        <h3>Зарегистрироваться</h3>
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

        const isInvalid = passwordOne !== passwordTwo || username === '' || email === ''

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    value={username}
                    onChange={event => this.setState(getValueByProp('username', event.target.value))}
                    type="text"
                    placeholder="Имя"
                />
                <input
                    value={email}
                    onChange={event => this.setState(getValueByProp('email', event.target.value))}
                    type="email"
                    placeholder="Электропочта"
                />
                <input
                    value={passwordOne}
                    onChange={event => this.setState(getValueByProp('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Пароль (min 6 символов)"
                    pattern="^[a-zA-Z0-9]{6,}"
                />
                <input
                    value={passwordTwo}
                    onChange={event => this.setState(getValueByProp('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Подтвердите пароль"
                />
                <button type="submit" disabled={isInvalid} className="sign-up-btn">Отправить</button>

                { error && <p>{error.message}</p> }
                
            </form>
        )
    }
}

const SignUpLink = (props) =>
    <p className={props.className}>
        Нет аккаунта?
        {' '}
        <Link to={routes.SIGN_UP}>Зарегистрируйтесь</Link>
    </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
}