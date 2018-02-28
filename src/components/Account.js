import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { PasswordForgetForm } from './PasswordForget'
import PasswordChangeForm from './PasswordChange'
import ChangeUserInfoForm from './ChangeUserInfo'
import withAuthorization from './withAuthorization'

const AccountPage = ({ authUser }) =>
    <div>
		<h4>Вы зачем-то зашли сюда</h4>
		<PasswordForgetForm />
		<PasswordChangeForm />
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