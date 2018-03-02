import React, { Component } from 'react'
import { Picker } from 'emoji-mart'

import { db } from '../../firebase'
import { ru } from '../../constants/dictionary'
import { isValidForm } from '../../utils'
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

    componentDidMount() {
        this.form.addEventListener('click', this.handleFormClick)
        this.form.addEventListener('keyup', this.handleKeyUp)
        this.showEmojiBtn.addEventListener('click', this.handleShowEmojiBtnClick)
    }

    componentWillUnmount() {
        this.form.removeEventListener('click', this.handleFormClick)
        this.form.removeEventListener('keyup', this.handleKeyUp)
        this.showEmojiBtn.removeEventListener('click', this.handleShowEmojiBtnClick)
    }

    render() {          
        return (
            <form onSubmit = {this.handleSubmit} ref={form => this.form = form}>
                <textarea value={this.state.text} onChange={this.handleTextChange} className="textarea" rows="3" placeholder="Сообщение..." />
                <label className="file-container"> 
                    <input type="file" onChange={this.handleFileChange} />
                </label>
                <span className="filename">{this.state.filename}</span>
                <div className="emoji-container" ref={emojiContainer => this.emojiContainer = emojiContainer}>
                    <span className="show-emoji-btn" ref={showEmojiBtn => this.showEmojiBtn = showEmojiBtn}></span>
                    {this.state.showEmojiPane ? <Picker set='twitter' onClick={this.handleEmojiPickerClick} showPreview={false} i18n={ru} /> : null}
                </div>
                <input type = "submit" className="submit-btn" disabled={!isValidForm(['text', 'file'], type => this.state[type] !== '')} value = "Отправить"/>
            </form>
        )
    }

    handleShowEmojiBtnClick = (event) => 
        this.setState({
            showEmojiPane: !this.state.showEmojiPane
        })

    handleEmojiPickerClick = (emoji, event) => {
        const inputText = this.state.text
        this.setState({ 
                text: `${inputText}  ${emoji.native}`,
                withEmoji: true
            })
    }

    handleFormClick = (event) => {
        if(this.state.showEmojiPane && !event.target.closest('.emoji-mart') && event.target.className !== 'show-emoji-btn') {
            this.setState({ showEmojiPane: false })
        }
    }

    handleSubmit = event => {
        const { user: {uid, displayName}, isPrivate, recipient } = this.props
        const dbRef = isPrivate ? db.privateMessagesRef(uid, recipient) : db.messagesRef()
        const time = Date.now()

        this.state.file ? 
        db.doSaveFile(dbRef, uid, this.state.file, this.state.text, this.state.withEmoji, time, displayName, recipient) :  
        db.doCreateMessage(dbRef, uid, this.state.text, this.state.withEmoji, time, displayName, recipient)

        this.setState({ ...INITIAL_STATE })
        event.preventDefault()
    }
    
    handleKeyUp = event => {
        if(event.keyCode === 13) this.handleSubmit(event)
    }

    handleTextChange = event => {
        const {value} = event.target
        this.setState({ text: value})
    }

    handleFileChange = event => {
        const {files} = event.target
        
        files.length > 0 ? 
        this.setState({ file: files[0], filename: files[0].name }) :
        this.setState({ file: '', filename: '' }) 
    }
     
}

export default MessageForm