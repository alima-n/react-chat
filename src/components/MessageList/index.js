import React, { Component } from 'react'
import { connect } from 'react-redux'

import { MESSAGES_SET } from '../../constants/AC'
import {db} from '../../firebase'
import Image from '../Image'
import PrivateMessageList from '../PrivateMessageList'
import './style.css'

class MessageList extends Component { 

	componentDidMount() {
		const { user, onSetMessages } = this.props
		
		const events = ['child_added', 'child_changed', 'child_removed']
		events.map(event => db.doAddListenerToMessages(event, onSetMessages))

		this.chat.addEventListener('click', this.handleMessagesClick)

	}

	componentWillUpdate() {
		// scroll at the bottom only if the user is already there
		this.shouldScrollBottom = this.messages.scrollTop + this.messages.offsetHeight === this.messages.scrollHeight
	}

	componentDidUpdate() {
		return this.shouldScrollBottom ? 
			   this.messages.scrollTop = this.messages.scrollHeight : 
			   null
	}

	render() {
		const {user, messages} = this.props
		if(!messages) return null
				
		return (
			<div className="message-list__wrapper" ref={chat => this.chat = chat} >
				<h2>Нафлудили тут</h2>
				<div className="message-list" ref={messages => this.messages = messages}>
					<ul className="message-list__messages" >	
						{this.getMessages(messages)}
					</ul>
				</div>	
			</div>
		)
	}

	getMessages = (messages) => {
		return (
			Object.keys(messages).map(key => 
				<li key={key}>
					<div className={this.getClassName(messages[key].uid)}>
						<div>
							<span>{messages[key].username}</span>
							<span className="message-list__time">{this.getTime(messages[key].time)}</span>
						</div>
						<div className="message-list__message">
							{messages[key].text}
							{messages[key].fileURI ? <Image uri = {messages[key].fileURI} className="message-list__img" alt={messages[key].username} /> : null}
						</div>
					</div>
				</li>
			)
		)
	}

	getTime = (timestamp) => {
		const time = new Date(timestamp)
		const hours = time.getHours()
		const minutes = time.getMinutes()

		return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
	}

	getClassName = (uid) => {
		const authUid = this.props.user.uid

		return uid === authUid ? 'is-mine' : null
	}

	handleMessagesClick = (event) => {
		console.log(event.target.classList.contains('back-to-chat'))

		if(event.target.classList.contains('back-to-chat')) {
			this.props.onClick()
		}
		event.preventDefault()
	}

}

const mapStateToProps = (state) => ({
	messages: state.messagesState.messages,
	privateMessages: state.privateMessagesState.privateMessages
})
  
const mapDispatchToProps = (dispatch) => ({
	onSetMessages: (messages) => dispatch({
		type: MESSAGES_SET,
		messages })
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)