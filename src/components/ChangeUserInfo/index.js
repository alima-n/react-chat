import React, { Component } from 'react'
import { db } from '../../firebase'
import './style.css'

const INITIAL_STATE = {
    file: '',
    fileName: '',
    photoURL: 'http://dev.nurgazieva.com/loader.svg',
    username: '',
    usernameInput: ''
}

class ChangeUserInfoForm extends Component {

    state = { ...INITIAL_STATE }

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve))

    async componentDidMount() {
        const { user:{uid} } = this.props

        this.setStateAsync({
            photoURL: await db.userRef(uid).once('value').then(snapshot => snapshot.val().photoURL),
            username: await db.userRef(uid).once('value').then(snapshot => snapshot.val().username)
        })
    }

    render() {
        const {user} = this.props

        return (
            <form onSubmit={this.onSubmit}>
                <div className="change-userpic clearfix"> 
                    <span>Изменить аватар</span>
                    <img className="change-userpic__userpic" src={this.state.photoURL} alt={user.displayName || user.email} />
                    <label className="userpic-container">
                        <input type="file" onChange={this.handleFileChange} />
                    </label>
                    {this.state.fileName}
                    {this.state.file? <button type="submit">Загрузить</button> : null}
                </div>
                <hr/>
                <div className="change-username clearfix"> 
                    <span>Имя</span>
                    <span>{this.state.username}</span>
                    <input type="text" onChange={this.handleTextChange} placeholder="Новое имя" />
                    <button type="submit">Изменить</button>
                </div>
            </form>
        )
    }

    handleFileChange = event => {
        const {files} = event.target
        files.length > 0 ? this.setState({ file: files[0], fileName: files[0].name }) : this.setState({ file: '', fileName: '' }) 
    }

    handleTextChange = event => {
        const {value} = event.target
        this.setState({ usernameInput: value})
    }

    onSubmit = (event) => {
        event.preventDefault()
        const { user: {uid} } = this.props
        if(this.state.file) this.setPhotoURL(uid) 
        if(this.state.usernameInput) this.setUsername(uid)
    }

    setPhotoURL = async (uid) => {
        this.setState({ photoURL: 'http://dev.nurgazieva.com/loader.svg' })
        await db.doUpdateUserpic(uid, this.state.file)

        this.setStateAsync({
            photoURL: await db.userRef(uid).once('value')
            .then(snapshot => snapshot.val().photoURL)
        })
    }

    setUsername = async (uid) => {
        const username = this.state.usernameInput

        this.setState({ 
            username,
            usernameInput: ''
        })
        await db.doUpdateUsername(uid, username)
    }

}

export default ChangeUserInfoForm