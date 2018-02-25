import { db, storage } from './firebase'

export const doCreateUser = (id, username, email, photoURL) =>
	db.ref(`users/${id}`).set({
		id,
		username,
		email,
		photoURL
	})

export const usersRef = db.ref('users').limitToLast(50)

export const onceGetUsers = () =>
  	db.ref('users').once('value')

export const doAddListenerToUsers = (event, action) => 
	usersRef.on(event, () => 
		onceGetUsers()
		.then(snapshot =>
			action(snapshot.val())
		)
	)

export const doCreateMessage = (uid, username, text, photoURL, time) => 
	db.ref(`messages`).push({
		uid,
		username,
		text,
		photoURL,
		time
	})

export const doCreatePrivateMessage = (chatName, senderUid, text, time) => 
	db.ref(`privateMessages/${chatName}`).push({
		senderUid,
		text, 
		time
	})

export const doSaveFile = async (uid, username, text, fileURI, photoURL, time) => {
	const data = await db.ref(`messages`).push({
		uid,
		username,
		text,
		fileURI: '',
		photoURL,
		time
	})
	const filePath = `${uid}/${fileURI.name}`
	const snapshot = await storage.ref(filePath).put(fileURI)
	const fullPath = snapshot.metadata.fullPath

	return  data.update({fileURI: storage.ref(fullPath).toString()})	
}

export const doSavePrivateFile = async (chatName, senderUid, text, fileURI, time) => {

	const data = await db.ref(`privateMessages/${chatName}`).push({
		senderUid,
		text,
		fileURI: '',
		time
	})

	const filePath = `${senderUid}/${fileURI.name}`
	const snapshot = await storage.ref(filePath).put(fileURI)
	const fullPath = snapshot.metadata.fullPath

	return  data.update({fileURI: storage.ref(fullPath).toString()})	
}

export const messagesRef = db.ref('messages').limitToLast(50)

export const onceGetMessages = () => 
	db.ref('messages').once('value')

export const doAddListenerToMessages = (event, action) => 
	messagesRef.on(event, () => 
		onceGetMessages()
		.then(snapshot =>
			action(snapshot.val())
		)
	)

export const doAddListenerToPrivateMessages = (event, action) => 
	db.ref(`privateMessages/`).limitToLast(50).on(event, () =>
		db.ref(`privateMessages/`).once('value')
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


	

	