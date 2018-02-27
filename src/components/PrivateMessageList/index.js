import React, { Component } from 'react'
import { connect } from 'react-redux'

import { PRIVATE_MESSAGES_SET } from '../../constants/AC'
import { db } from '../../firebase'
import { Message } from '../Message'
import { checkBottomPos, scrollBottom } from '../../utils/'
import * as events from '../../constants/events'

class PrivateMessageList extends Component {
    
    componentDidMount() {
        const { onSetPrivateMessages } = this.props
        Object.keys(events).map(key => db.doAddListenerToRef(db.privateMessagesQuery, events[key], onSetPrivateMessages))	 

        this.chat.addEventListener('click', this.handleChatClick)
    }

    componentWillUpdate() {
		this.shouldScrollBottom = checkBottomPos(this.messages)
	}

	componentDidUpdate() {
		return this.shouldScrollBottom ? scrollBottom(this.messages) : null
	}

    render() {
        const {recipientUsername, privateMessages, chatName } = this.props
        return (
            <div className="message-list__wrapper" ref={chat => this.chat = chat} >
                <h3>Приватная беседа с {recipientUsername}</h3>
                <span className="message-list__back-to-public"> &#8592; В общий чат </span>
                <div className="message-list" ref={messages => this.messages = messages}>
                    <ul className="message-list__messages" >	
                        {privateMessages[chatName] ? this.getPrivateMessages(privateMessages[chatName]) : null }      
                    </ul>
                </div>	
            </div>
        ) 
    }

    handleChatClick = (event) => 
        event.target.classList.contains('message-list__back-to-public') ? this.props.onClick() : null

    getPrivateMessages = (privateMessages) => {
		return (
			Object.keys(privateMessages).map(key =>
				<li key={key}>
                    <Message message={privateMessages[key]} user={this.props.user} />
				</li>
			)
		)
    }

}

const mapStateToProps = (state) => ({
	privateMessages: state.privateMessagesState.privateMessages
})

const mapDispatchToProps = (dispatch) => ({
	onSetPrivateMessages: (privateMessages) => dispatch({
		type: PRIVATE_MESSAGES_SET,
		privateMessages }),
})

export default connect(mapStateToProps, mapDispatchToProps)(PrivateMessageList)