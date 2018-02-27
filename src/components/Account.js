import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { PasswordForgetForm } from './PasswordForget'
import PasswordChangeForm from './PasswordChange'
import withAuthorization from './withAuthorization'

const AccountPage = ({ authUser }) =>
    <div>
		<h4>Вы зачем-то зашли сюда, {authUser.displayName || authUser.email}</h4>
		<PasswordForgetForm />
		<PasswordChangeForm />
    </div>

const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
})

const authCondition = (authUser) => !!authUser

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps)
)(AccountPage)