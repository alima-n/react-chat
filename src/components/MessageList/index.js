import React, { Component } from 'react'
import { connect } from 'react-redux'

import { MESSAGES_SET } from '../../constants/AC'
import { db } from '../../firebase'
import { Message } from '../Message'
import * as events from '../../constants/events'
import { checkBottomPos, scrollBottom } from '../../utils/'
import './style.css'

class MessageList extends Component { 

	componentDidMount() {
		const { onSetMessages } = this.props
		Object.keys(events).map(key => db.doAddListenerToRef(db.messagesQuery, events[key], onSetMessages))	 
	}

	componentWillUpdate() {
		this.shouldScrollBottom = checkBottomPos(this.messageList)
	}

	componentDidUpdate() {
		return this.shouldScrollBottom ? scrollBottom(this.messageList) : null
	}

	render() {
		const {messages} = this.props
		if(!messages) return null
		
		return (
			<div className="message-list__wrapper">
				<h2>Они еще и разговаривают</h2>
				<div className="message-list" ref={messageList => this.messageList = messageList}>
					<ul className="message-list__messages" >	
						{Object.keys(messages).map(key => 
							<li key={key}>
								<Message message={messages[key]} user={this.props.user} />
							</li>
						)}
					</ul>
				</div>	
			</div>
		)
	}
	
}

const mapStateToProps = (state) => ({
	messages: state.messagesState.messages,
})
  
const mapDispatchToProps = (dispatch) => ({
	onSetMessages: (messages) => dispatch({
		type: MESSAGES_SET,
		messages })
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)