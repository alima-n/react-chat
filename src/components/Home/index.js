import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import UserList from '../UserList'
import MessageList from '../MessageList'
import PrivateMessageList from '../PrivateMessageList'
import MessageForm from '../MessageForm'
import { MESSAGES_SET, PRIVATE_MESSAGES_SET } from '../../constants/AC'
import { db } from '../../firebase'
import * as events from '../../constants/events'
import {getChatName} from '../../utils'
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

	componentDidMount() {
		const { onSetMessages } = this.props
		Object.keys(events).map(key => db.doAddListenerToRef(db.messagesQuery, events[key], onSetMessages))	 
	}

	render() {
		const { authUser } = this.props
		const { isPrivate, chatName, recipientUsername } = this.state

		return (
			<div>
				<div className="home">
					<UserList user={authUser} onClick={this.handleUserlistClick} chatName={this.state.chatName}/>
					<div className="chat">
						{isPrivate ? <PrivateMessageList 
										user={authUser} 
										recipient={recipientUsername} 
										messages={this.props.privateMessages[chatName]} 
										onClick={this.handleChatClick} 
									/> : 
									<MessageList 
										user={authUser} 
										messages={this.props.messages} />
						}
						<MessageForm user={authUser} {...this.state}/>
					</div>
				</div>
			</div>
		)
	}

	handleUserlistClick = (recipient, recipientUsername, authUser) => {
		const chatName = getChatName(authUser, recipient)
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

const mapStateToProps = (state, ownProps) => ({
	authUser: state.sessionState.authUser,
	messages: state.messagesState.messages,
	privateMessages: state.privateMessagesState
})
  
const authCondition = (authUser) => !!authUser

const mapDispatchToProps = (dispatch, ownProps) => ({
	onSetMessages: (messages) => dispatch({
		type: MESSAGES_SET,
		messages 
	}),
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
