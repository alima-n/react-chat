import React from 'react'

import { getUserStatusText, getUserStatusClass } from '../utils'

export const User = (props) => {
    
    const { user } = props

    return (
        <div className="user-list__user">
            <img src={user.photoURL} alt={user.username} className="user-list__avatar"></img>
            <div className="user-list__about"> 
                <div className="user-list__name"> {user.username} </div>
                <div className="user-list__status"> 
                    <span className={getUserStatusClass(user)}></span>
                    {getUserStatusText(user)} 
                </div>
            </div>
        </div>
    )
    
}

