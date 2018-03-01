import React, { Component } from 'react'
import { connect } from 'react-redux'

import { USERS_SET } from '../../constants/AC'
import { db } from '../../firebase'
import * as events from '../../constants/events'
import { User } from '../User'

import './style.css'

class UserList extends Component {

	componentDidMount() {
		const { onSetUsers } = this.props
		Object.keys(events).map(key => db.doAddListenerToRef(db.usersRef, events[key], onSetUsers))	 
		
		this.userlist.addEventListener('click', this.handleUserClick)
	}
	
	render() {
		const {users} = this.props

		if(!users) return null
		
		return (
			<div className="user-list__wrapper">
				<h2>Маленький паноптикум</h2>
				<div className="user-list">
					<ul className="user-list__users" ref={userlist => this.userlist = userlist}>
						{Object.keys(users).map(key => 
							<li key={key} data-uid={users[key].id} data-username={users[key].username}>
								<User user={users[key]} />
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

		const { user } = this.props
		
		if(userClasses.some( c => classList.contains(c) )) {
			const data = event.target.closest('li').dataset
			this.props.onClick(data.uid, data.username, user.uid)
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