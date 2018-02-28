import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import SignOutButton from '../../components/SignOut'
import * as routes from '../../constants/routes'
import './style.css'

const Navigation = ({ authUser }) =>
    <div>
        {authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </div>

const NavigationAuth = () =>
    <ul className="menu-top">
        <li><Link to={routes.LANDING}>Домой</Link></li>
        <li><Link to={routes.HOME}>Чат</Link></li>
        <li><Link to={routes.ACCOUNT}>Аккаунт</Link></li>
        <li><SignOutButton /></li>
    </ul>

const NavigationNonAuth = () =>
    <ul className="menu-top">
        <li><Link to={routes.LANDING}>Домой</Link></li>
        <li><Link to={routes.SIGN_IN}>Войти</Link></li>
    </ul>

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
})
  
export default connect(mapStateToProps)(Navigation)