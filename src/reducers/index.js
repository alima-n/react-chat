import { combineReducers } from 'redux'
import sessionReducer from './session'
import userReducer from './user'
import messageReducer from './messages'
import privateMessageReducer from './privateMessages'

const rootReducer = combineReducers({
    sessionState: sessionReducer,
    userState: userReducer,
    messagesState: messageReducer,
    privateMessagesState: privateMessageReducer
})

export default rootReducer