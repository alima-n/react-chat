import React, { Component } from 'react'
import { connect } from 'react-redux'

import { PRIVATE_MESSAGES_SET } from '../../constants/AC'
import {db} from '../../firebase'
import Image from '../Image'

class PrivateMessageList extends Component {

    componentDidMount() {
        const {user, recipient, onSetPrivateMessages, chatName } = this.props
        const events = ['child_added', 'child_changed', 'child_removed']
        console.log('COMPONENT DID MOUNT')
        events.map(event => db.doAddListenerToPrivateMessages(event, onSetPrivateMessages))	 
    }
    
    render() {
        const {user, recipient, privateMessages, chatName } = this.props
        console.log('Private MessageList PROPS: ', this.props)
        return (
            <div className="message-list__wrapper" ref={chat => this.chat = chat} >
                <h2>Приватная беседа с {recipient}</h2>
                <div className="message-list" ref={messages => this.messages = messages}>
                    <ul className="message-list__messages" >	
                        {privateMessages[chatName] ? this.getPrivateMessages(user, recipient, privateMessages[chatName]) : null }      
                    </ul>
                </div>	
            </div>
        ) 
    }

    getPrivateMessages = (user, recipient, privateMessages) => {
		return (
			Object.keys(privateMessages).map(key =>
				<li key={key}>
                    <div className={this.getClassName(privateMessages[key].senderUid)}>
                        <span className="message-list__time">{this.getTime(privateMessages[key].time)}</span>
                        <div className="message-list__message">
                            {privateMessages[key].text}
                            {privateMessages[key].fileURI ? 
                            <Image uri = {privateMessages[key].fileURI} className="message-list__img" alt={privateMessages[key].username} /> : 
                            null}
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