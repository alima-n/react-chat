import React, { Component } from 'react'
import { connect } from 'react-redux'

import { USERS_SET } from '../../constants/AC'
import {db} from '../../firebase'
import './style.css'

class UserList extends Component {

	componentDidMount() {
		const { onSetUsers } = this.props
		
		db.onceGetUsers().then(snapshot => 
			onSetUsers(snapshot.val()) 
		)

		const events = ['child_added', 'child_changed', 'child_removed']
		events.map(event => db.doAddListenerToUsers(event, onSetUsers))

		this.userlist.addEventListener('click', this.handleUserClick)
		
	}
	
	render() {
		const {users} = this.props

		if(!users) return null
		
		return (
			<div className="user-list__wrapper">
				<h2>Пользователи</h2>
				<div className="user-list">
					<ul className="user-list__users" ref={userlist => this.userlist = userlist}>
						{ Object.keys(users).map(key => 
							<li key={key} className="user-list__user" data-uid={users[key].id} data-username={users[key].username}>
								<img src={users[key].photoURL} alt={users[key].username} className="user-list__avatar"></img>
								<div className="user-list__about"> 
									<div className="user-list__name"> {users[key].username} </div>
									<div className="user-list__status"> 
										<span className={this.getUserStatus(users[key])}></span>
										{this.getStatusText(users[key])} 
									</div>
								</div>
							</li>
						)}
					</ul>
				</div>
			</div>
		)
	}

	handleUserClick = (event) => {
		const userClasses = ['user-list__user', 'user-list__avatar', 'user-list__about', 'user-list__name', 'user-list__status']
		const classList = event.target.classList
		const {user} = this.props
		
		if(userClasses.some( c => classList.contains(c) )) {
			const data = event.target.closest('li').dataset
			this.props.onClick(data.uid, data.username, user.uid)
		}
	}

	getUserStatus = (user) => {
		return user.connections ? 'online' : 'offline'
	}

	getStatusText = (user) => {
		if(user.connections) return 'Здесь'
		
		if(user.lastOnline) {
			const lastOnline = new Date(user.lastOnline)
			const year = lastOnline.getFullYear()
			const month = lastOnline.getMonth() + 1
			const date = lastOnline.getDate()
			const hours = lastOnline.getHours()
			const minutes = lastOnline.getMinutes()

			const now = new Date()
			const diff = now - lastOnline
			const dayInMs = 1000*60*60*24

			if (diff < dayInMs) return `Отсутствует с ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
			
			if (diff > dayInMs && diff < dayInMs*2) return `Вчера видели в ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
			
			if (diff > dayInMs*2) return `Не слышно с ${date < 10 ? '0' + date : date}.${month < 10 ? '0'+ month : month}.${year.toString().slice(-2)}`
		}
	}
}

const mapStateToProps = (state) => ({
	users: state.userState.users,
})
  
const mapDispatchToProps = (dispatch) => ({
	onSetUsers: (users) => dispatch({ 
		type: USERS_SET, 
		users }),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)