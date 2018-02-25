import {PRIVATE_MESSAGES_SET} from '../constants/AC'

const INITIAL_STATE = {
    privateMessages: {},
}
  
const applySetMessages = (state, action) => ({
    ...state,
    privateMessages: action.privateMessages
})
  
function privateMessageReducer(state = INITIAL_STATE, action) {
    switch(action.type) {

      case PRIVATE_MESSAGES_SET: {
        return applySetMessages(state, action)
      }

      default : return state
    }
}
  
export default privateMessageReducer