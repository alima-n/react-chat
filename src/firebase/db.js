import { db, storage } from './firebase'

export const doCreateUser = (id, username, email, photoURL) =>
	db.ref(`users/${id}`).set({
		id,
		username,
		email,
		photoURL
	})

export const onceGetUsers = () =>
  	db.ref('users').once('value')

export const doCreateMessage = (ref, uid, text, emoji, time, username) => 
	ref.push({
		uid,	
		text,
		emoji,
		time,
		username
	})

export const messagesQuery = db.ref('messages').limitToLast(100)
export const privateMessagesQuery = db.ref('privateMessages').limitToLast(100)
export const usersRef = db.ref('users').limitToLast(50)

export const privateMessagesRef = chatName => 
	db.ref(`privateMessages/${chatName}`)

export const messagesRef = () => 
	db.ref('messages')

export const doSaveFile = async (ref, uid, fileURI, text, emoji, time, username) => {
	const data = await ref.push({
		uid,
		fileURI: '',
		text,
		emoji,
		time,
		username
	})

	const filePath = `${uid}/${fileURI.name}`
	const snapshot = await storage.ref(filePath).put(fileURI)
	const fullPath = snapshot.metadata.fullPath

	return  data.update({fileURI: storage.ref(fullPath).toString()})	
}

export const doAddListenerToRef = (ref, event, action) => 
	ref.on(event, () => 
		ref.once('value')
		.then(snapshot =>
			action(snapshot.val())
		)
	)

export const connectedRef = db.ref('.info/connected')

const userLastOnlineRef = (uid) =>
	db.ref(`users/${uid}/lastOnline`)

const connectionsRef = (uid) => 
	db.ref(`users/${uid}/connections`)

export const manageUserPresence = (uid) => {
	const lastOnline = userLastOnlineRef(uid)
    const connections = connectionsRef(uid)

	connectedRef.on('value', snap => {
		if (snap.val() === true) {
			connections.push(true)
			connections.onDisconnect().remove()
			lastOnline.onDisconnect().set(Date.now())
		}
	})
}


	

	