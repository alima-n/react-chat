import * as firebase from 'firebase'

const config = { 
    apiKey: "AIzaSyDiDTNfF19YcJ2oGPK_bHOo8HPp5DWWeSI",
    authDomain: "react-chat-4.firebaseapp.com",
    databaseURL: "https://react-chat-4.firebaseio.com",
    projectId: "react-chat-4",
    storageBucket: "react-chat-4.appspot.com",
    messagingSenderId: "1003611561060"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth()
const db = firebase.database()
const storage = firebase.storage()


export {
  auth,
  db,
  storage,
}