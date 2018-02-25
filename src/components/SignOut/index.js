import React from 'react'

import { auth } from '../../firebase'
import './style.css'

const SignOutButton = () =>
    <button type="button" className="signout-btn" onClick={auth.doSignOut}>
    </button>

export default SignOutButton