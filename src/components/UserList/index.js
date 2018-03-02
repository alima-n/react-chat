import React, { Component } from 'react'

import User from '../User'
import './style.css'

class UserList extends Component {

	render() {
		const { user, users } = this.props

		if(!users) return null
		return (
			<div className="user-list__wrapper">
				<h2>Маленький паноптикум</h2>
				<div className="user-list">
					<ul className="user-list__users" ref={userlist => this.userlist = userlist}>
						{Object.keys(users).map(key => 
							<li key={key} data-uid={users[key].id} data-username={users[key].username}>
								<User user={users[key]} authUser={user} handleClick={this.handleUserClick} />
							</li>
						)}
					</ul>
				</div>
			</div>
		)
	}

	handleUserClick = (recipient, username) => {
		const { user } = this.props
		this.props.onClick(recipient, username, user.uid)
	}
}

export default UserList