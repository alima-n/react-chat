import {PRIVATE_MESSAGES_SET} from '../constants/AC'


const applySetMessages = (state = {}, action) => ({
    ...state,
    [action.chatName]: ({ ...state[action.chatName], ...action.privateMessages })
})
  
function privateMessageReducer(state = {}, action) {
    switch(action.type) {

      case PRIVATE_MESSAGES_SET: {
        return applySetMessages(state, action)
      }

      default : return state
    }
}
  
export default privateMessageReducer