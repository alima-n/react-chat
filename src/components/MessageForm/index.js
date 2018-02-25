import React, { Component } from 'react'

import { db } from '../../firebase'
import './style.css'

const INITIAL_STATE = {
	text: '',
    file: '',
    filename: '',
}


class MessageForm extends Component {

    state = { ...INITIAL_STATE }

    render() {          
        return (
            <form onSubmit = {this.handleSubmit} onKeyUp={this.handleKeyUp}>
                <textarea value={this.state.text} onChange={this.handleTextChange} className="textarea" rows="3" placeholder="Да пошли вы все" />
                <label className="fileContainer"> 
                    <input type="file" onChange={this.handleFileChange} />
                </label>
                <span className="filename">{this.state.filename}</span>
                <input type = "submit" className="submit-btn" disabled={!this.isValidForm()} value = "Send"/>
            </form>
        )
    }

    isValidForm = () => ['text', 'file'].some(this.isValidField)

    isValidField = type => this.state[type] !== ''

    handleSubmit = (event) => {
        const { user, isPrivate, recipient, chatName } = this.props
        const time = Date.now()

        if(!recipient) {
            this.state.file ?
            db.doSaveFile(user.uid, user.displayName, this.state.text, this.state.file, user.photoURL, time) : 
            db.doCreateMessage(user.uid, user.displayName, this.state.text, user.photoURL, time)
        } else {
            this.state.file ?
            db.doSavePrivateFile(chatName, user.uid, this.state.text, this.state.file, time) :
            db.doCreatePrivateMessage(chatName, user.uid, this.state.text, time)
        }

        this.setState({ ...INITIAL_STATE })

        event.preventDefault()
    }
    
    handleKeyUp = (event) => {
        if(event.keyCode === 13) this.handleSubmit(event)
    }

    handleTextChange = (event) => {
        const {value} = event.target
        
        this.setState({
            text: value
        })
    }

    handleFileChange = (event) => {
        const {files} = event.target

        this.setState({
            file: files[0],
            filename: files[0].name
        })
    }
     
}

export default MessageForm