import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Message } from '../Message'
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
        const { recipientUsername, privateMessages } = this.props
        console.log('Private message list: ', this.props)
      
        return (
            <div className="message-list__wrapper" ref={chat => this.chat = chat} >
                <h3>Приватная беседа с {recipientUsername}</h3>
                <span className="message-list__back-to-public"> &#8592; В общий чат </span>
                <div className="message-list" ref={messages => this.messages = messages}>
                    <ul className="message-list__messages" >	
                        {privateMessages ? this.getPrivateMessages(privateMessages) : null }      
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

const mapStateToProps = (state, ownProps) => ({
    privateMessages: state.privateMessagesState[ownProps.chatName]
})

export default connect(mapStateToProps)(PrivateMessageList)