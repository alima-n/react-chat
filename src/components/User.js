import React, { Component } from 'react'
import { db } from '../firebase'
import { getUserStatusText, getUserStatusClass, getChatName } from '../utils'

class User extends Component {
    
    state = {
        hasNewMessage: false
    }

    componentDidMount(){
        const { authUser, user } = this.props
        const chatName = getChatName(authUser.uid, user.id)

        db.doAddListenerToRef(db.privateMessagesQuery(chatName), 'child_added', this.notifyOnNewMessage)
        this.user.addEventListener('click', this.handleUserClick)
    }

    componentWillUnmount(){
        this.user.removeEventListener('click', this.handleUserClick)
    }

    handleUserClick = (event) => {
        const { user: {id,username} } = this.props
        this.setState({
            hasNewMessage: false
        })

        this.props.handleClick(id, username)
    }

    notifyOnNewMessage = (messages) => {
        const { authUser: {uid} } = this.props
        // eslint-disable-next-line
        Object.keys(messages).map(key => {
            if(uid === messages[key].recipient && !messages[key].read) this.setState({ hasNewMessage: true })
        })
    }

    render() {
        const { authUser, user } = this.props

        return (
            <div className="user-list__user" ref={user => this.user = user}>
                <img src={user.photoURL} alt={user.username} className="user-list__avatar"></img>
                <div className="user-list__about"> 
                    <div className="user-list__name"> 
                        {user.username}  
                        {this.state.hasNewMessage ? <span className="new-message-notification"></span> : null}
                        {authUser.uid === user.id ? <span className="this-is-you">(это вы)</span> : null} 
                    </div>
                    <div className="user-list__status"> 
                        <span className={getUserStatusClass(user)}></span>
                        {getUserStatusText(user)} 
                    </div>
                </div>
            </div>
        )
    }
    
}

export default User

