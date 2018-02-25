import * as firebase from 'firebase'
import { auth } from './firebase'

export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password)

export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password)

export const doSignOut = () =>
    auth.signOut()

export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email)

export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password)

export const doUpdateAvatar = (url) => 
    auth.currentUser.updateProfile({
        photoURL: url
    })

export const doUpdateUsername = (username) => 
    auth.currentUser.updateProfile({
        displayName: username
    })
    
export const doSignInWithProvider = (provider) => 
    auth.signInWithPopup(provider)
    

export const providerGoogle = new firebase.auth.GoogleAuthProvider()
export const providerTwitter = new firebase.auth.TwitterAuthProvider()
export const providerGithub = new firebase.auth.GithubAuthProvider()