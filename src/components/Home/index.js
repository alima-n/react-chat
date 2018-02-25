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
	recipient: '',
	recipientUsername: ''
}

class HomePage extends Component {

	state = { ...INITIAL_STATE }

	render() {
		const { authUser } = this.props
		const { isPrivate, repicientUid, RepicientUsername, chatName } = this.state

		console.log('---- rerendering Home page ', this.state)
		return (
			<div>
				<div className="home">
					<UserList user={authUser} onClick ={this.handleUserlistClick}/>
					<div className="chat">
						{isPrivate ? <PrivateMessageList user={authUser} recipient={repicientUid} chatName={chatName} /> : <MessageList user={authUser} />}
						<MessageForm 
							user={authUser} 
							isPrivate={isPrivate} 
							recipient={repicientUid}
							chatName={chatName}
						/>
					</div>
				</div>
			</div>
		)
	}

	handleUserlistClick = (repicientUid, RepicientUsername, userUid) => {
		const chatName = repicientUid > userUid ? 
						 repicientUid + '_' + userUid : 
						 userUid + '_' + repicientUid

		this.setState({
			isPrivate: true,
			repicientUid,
			RepicientUsername,
			chatName
		})
	}

	handleChatClick = () => {
		this.setState({ ...INITIAL_STATE })
		console.log("CLICK")
	}
}


const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
})
  
const authCondition = (authUser) => !!authUser

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps)
)(HomePage)