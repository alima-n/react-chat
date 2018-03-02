import React, { Component } from 'react'

import { Message } from '../Message'
import { checkBottomPos, scrollBottom } from '../../utils/'
import './style.css'

class MessageList extends Component { 

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

export default MessageList