import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { PRIVATE_MESSAGES_SET } from '../../constants/AC'
import { db } from '../../firebase'
import * as events from '../../constants/events'

import UserList from '../UserList'
import MessageList from '../MessageList'
import PrivateMessageList from '../PrivateMessageList'
import MessageForm from '../MessageForm'
import withAuthorization from '../withAuthorization'
import './style.css'

const INITIAL_STATE = {
	isPrivate: false,
	recipient: '',
	recipientUsername: '',
	chatName: ''
}

class HomePage extends Component {

	state = { ...INITIAL_STATE }

	render() {
		const { authUser } = this.props
		const { isPrivate } = this.state
		console.log('HOME props: ', this.props)
		return (
			<div>
				<div className="home">
					<UserList user={authUser} onClick={this.handleUserlistClick}/>
					<div className="chat">
						{isPrivate ? 
						<PrivateMessageList user={authUser} {...this.state} onClick={this.handleChatClick} /> : 
						<MessageList user={authUser} />}
						<MessageForm user={authUser} {...this.state}/>
					</div>
				</div>
			</div>
		)
	}

	getChatName = (uid1, uid2) => {
		return (uid1 > uid2) ? `${uid1}_${uid2}` : `${uid2}_${uid1}`
	}

	handleUserlistClick = (recipient, recipientUsername, authUser) => {
		const chatName = this.getChatName(authUser, recipient)
		const { onSetPrivateMessages } = this.props
		Object.keys(events).map(key => 
			db.doAddListenerToRef(db.privateMessagesQuery(chatName), events[key], onSetPrivateMessages.bind(null, chatName))
		)

		this.setState({
			isPrivate: true,
			recipient,
			recipientUsername,
			chatName
		})
	}

	handleChatClick = () => {
		this.setState({ ...INITIAL_STATE })
	}
}

const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
})
  
const authCondition = (authUser) => !!authUser

const mapDispatchToProps = (dispatch, ownProps) => ({
	onSetPrivateMessages: (chatName, privateMessages) => dispatch({
		type: PRIVATE_MESSAGES_SET,
        privateMessages,
		chatName
    }),
})

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps, mapDispatchToProps)
)(HomePage)