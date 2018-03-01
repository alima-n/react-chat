import React from 'react'
import { Twemoji } from 'react-emoji-render'

import Image from './Image'
import { getTime } from '../utils'

export const Message = (props) => {

    const { message, user } = props

    const getClassName = uid => 
        uid === user.uid ? 'is-mine' : null

    return (
        <div className={getClassName(message.uid)}>
            <div>
                {console.log('Rendering message')}
                <span>{message.username}</span>
                <span className="message-list__time">{getTime(message.time)}</span>
            </div>
            <div className="message-list__message">
                {message.emoji ? <Twemoji text={message.text} /> : message.text}
                {message.fileURI ? <Image uri = {message.fileURI} className="message-list__img" alt={message.username} /> : null}
            </div>
		</div>
    )
}


