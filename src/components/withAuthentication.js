import React from 'react'
import { connect } from 'react-redux'

import { firebase, db } from '../firebase'
import { AUTH_USER_SET } from '../constants/AC'

const withAuthentication = (Component) => {
    class WithAuthentication extends React.Component {
 
        componentDidMount() {
            const { onSetAuthUser } = this.props

            firebase.auth.onAuthStateChanged(authUser => {
                if(authUser) {
                    onSetAuthUser(authUser)
                    db.manageUserPresence(authUser.uid)

                }                         
            })
        }

        render() {
            return (
                <Component />
            )
        }
    }

    const mapDispatchToProps = (dispatch) => ({
            onSetAuthUser: (authUser) => dispatch({ 
                type: AUTH_USER_SET, 
                authUser }),
    })
    
    return connect(null, mapDispatchToProps)(WithAuthentication)
}

export default withAuthentication