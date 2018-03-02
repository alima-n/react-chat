import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { PasswordForgetForm } from '../PasswordForget'
import ChangeUserInfoForm from '../ChangeUserInfo'
import withAuthorization from '../withAuthorization'
import './style.css'

const AccountPage = ({ authUser }) =>
    <div className="account-block">
		<h3>Зародыш личного кабинета</h3>
		<PasswordForgetForm className="pw-forget-form clearfix"/>
		<hr/>
		<ChangeUserInfoForm user={authUser}/>
    </div>

const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
})

const authCondition = (authUser) => !!authUser

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps)
)(AccountPage)