import React, { Component } from 'react'
import { Picker } from 'emoji-mart'

import { db } from '../../firebase'
import { ru } from '../../constants/dictionary'
import './style.css'

const INITIAL_STATE = {
    text: '',
    withEmoji: false,
    showEmojiPane: false,
    file: '',
    filename: '',
}

class MessageForm extends Component {
    state = { ...INITIAL_STATE }

    render() {          
        return (
            <form onSubmit = {this.handleSubmit} onKeyUp={this.handleKeyUp}>
                <textarea value={this.state.text} onChange={this.handleTextChange} className="textarea" rows="3" placeholder="Да пошли вы все" />
                <label className="file-container"> 
                    <input type="file" onChange={this.handleFileChange} />
                </label>
                <span className="filename">{this.state.filename}</span>
                <div className="emoji-container">
                    <span className="show-emoji-btn" onClick={this.showEmojiPane}></span>
                    {this.state.showEmojiPane ? <Picker set='twitter' onClick={this.addEmoji} showPreview={false} i18n={ru} /> : null}
                </div>
                <input type = "submit" className="submit-btn" disabled={!this.isValidForm()} value = "Send"/>
            </form>
        )
    }
    showEmojiPane = (event) => {
        this.setState({
            showEmojiPane: !this.state.showEmojiPane
        })
    }

    addEmoji = (emoji, event) => {
        const inputText = this.state.text
        this.setState({ 
                text: `${inputText}  ${emoji.native}`,
                withEmoji: true
            })
    }



    isValidForm = () => ['text', 'file'].some(this.isValidField)

    isValidField = type => this.state[type] !== ''

    handleSubmit = event => {
        const { user: {uid, displayName}, isPrivate, chatName } = this.props
        const dbRef = isPrivate ? db.privateMessagesRef(chatName) : db.messagesRef()
        const time = Date.now()

        this.state.file ? 
        db.doSaveFile(dbRef, uid, this.state.file, this.state.text, this.state.withEmoji, time, displayName) :  
        db.doCreateMessage(dbRef, uid, this.state.text, this.state.withEmoji, time, displayName)

        this.setState({ ...INITIAL_STATE })
        event.preventDefault()
    }
    
    handleKeyUp = event => {
        if(event.keyCode === 13) this.handleSubmit(event)
    }

    handleTextChange = event => {
        const {value} = event.target

        this.setState({
            text: value
        })
    }

    handleFileChange = event => {
        const {files} = event.target

        this.setState({
            file: files[0],
            filename: files[0].name
        })
    }
     
}

export default MessageForm