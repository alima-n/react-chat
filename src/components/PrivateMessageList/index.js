import React, { Component } from 'react'

import { Message } from '../Message'
import { db } from '../../firebase'
import { checkBottomPos, scrollBottom } from '../../utils/'

class PrivateMessageList extends Component {
    
    componentDidMount() {
        this.chat.addEventListener('click', this.handleChatClick)
    }

    componentWillUpdate() {
		this.shouldScrollBottom = checkBottomPos(this.messages)
	}

	componentDidUpdate() {
       return this.shouldScrollBottom ? scrollBottom(this.messages) : null
	}

    render() {
        const { recipient, messages } = this.props
        
        return (
            <div className="message-list__wrapper" ref={chat => this.chat = chat} >
                <h3>Приватная беседа с {recipient}</h3>
                <span className="message-list__back-to-public"> &#8592; В общий чат </span>
                <div className="message-list" ref={messages => this.messages = messages}>
                    <ul className="message-list__messages" >	
                        {messages ? this.getPrivateMessages(messages) : null }      
                    </ul>
                </div>	
            </div>
        ) 
    }

    getPrivateMessages = (messages) => {
        const { chatName } = this.props
		return (
            Object.keys(messages).map(key => {
                db.doMarkMessageAsRead(chatName, key)
                    return (    
                        <li key={key}>
                            <Message message={messages[key]} user={this.props.user} />
                        </li>
                    )
                } 
			)
		)
    }

    handleChatClick = (event) => 
        event.target.classList.contains('message-list__back-to-public') ? this.props.onClick() : null
}

export default PrivateMessageList