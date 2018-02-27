import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import UserList from '../UserList'
import MessageList from '../MessageList'
import PrivateMessageList from '../PrivateMessageList'
import MessageForm from '../MessageForm'
import withAuthorization from '../withAuthorization'
import './style.css'

const INITIAL_STATE = {
	isPrivate: false,
	repicient: '',
	recipientUsername: '',
	chatName: ''
}

class HomePage extends Component {

	state = { ...INITIAL_STATE }

	render() {
		const { authUser } = this.props
		const { isPrivate } = this.state

		return (
			<div>
				<div className="home">
					<UserList user={authUser} onClick={this.handleUserlistClick}/>
					<div className="chat">
						{isPrivate ? <PrivateMessageList user={authUser} {...this.state} onClick={this.handleChatClick} /> : 
						<MessageList user={authUser} />}
						<MessageForm user={authUser} {...this.state}/>
					</div>
				</div>
			</div>
		)
	}

	handleUserlistClick = (repicient, recipientUsername, userUid) => {
		const chatName = getChatName(repicient, userUid)
		this.setState({
			isPrivate: true,
			repicient,
			recipientUsername,
			chatName
		})
	}

	handleChatClick = () => {
		this.setState({ ...INITIAL_STATE })
	}
}

const getChatName = (id1, id2) =>
	id1 > id2 ? `${id1}_${id2}` : `${id2}_${id1}`

const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
})
  
const authCondition = (authUser) => !!authUser

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps)
)(HomePage)