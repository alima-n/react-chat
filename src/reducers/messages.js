import {MESSAGES_SET} from '../constants/AC'

const INITIAL_STATE = {
    messages: {},
}
  
const applySetMessages = (state, action) => ({
    ...state,
    messages: action.messages
})
  
function messageReducer(state = INITIAL_STATE, action) {
    switch(action.type) {

      case MESSAGES_SET: {
        return applySetMessages(state, action)
      }

      default : return state
    }
}
  
export default messageReducer