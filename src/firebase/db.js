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

export const getUsername = (uid) => 
	db.ref(`users/${uid}/username`).once('value').then(snapshot =>
		snapshot.val()
	)

export const doCreateMessage = async (ref, uid, text, emoji, time, recipient) => 
	ref.push({
		uid,	
		text,
		emoji,
		time,
		username: await getUsername(uid),
		recipient,
		read: false
	})

export const messagesQuery = db.ref('messages').limitToLast(100)
export const privateMessagesQuery = chatName => db.ref(`privateMessages/${chatName}`).limitToLast(100)
export const usersRef = db.ref('users').limitToLast(50)

export const privateMessagesRef = (uid, recipient) => {
	const chatName = uid > recipient ? uid+'_'+recipient : recipient+'_'+uid
	return db.ref(`privateMessages/${chatName}`)
}

export const messagesRef = () => 
	db.ref('messages')

export const doSaveFile = async (ref, uid, fileURI, text, emoji, time, recipient) => {
	const data = await ref.push({
		uid,
		fileURI: '',
		text,
		emoji,
		time,
		username: await getUsername(uid),
		recipient,
		read: false
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

export const userRef = (uid) =>
	db.ref(`users/${uid}`)

export const doUpdateUserpic = async (uid, file) => {
	const data = await db.ref(`users/${uid}`)
	const snapshot = await storage.ref(`${uid}/photoURL/photoURL`).put(file)
	const fileRef = await storage.refFromURL(storage.ref(snapshot.metadata.fullPath).toString())
	const url = await fileRef.getMetadata()
                .then(metadata => metadata.downloadURLs[0])

	return data.update({
		photoURL: url
	})
}

export const doUpdateUsername = async (uid, name) => {
	const data = await db.ref(`users/${uid}`)

	return data.update({
		username: name
	})
}

export const doMarkMessageAsRead = async (chatName, key) => {
	const data = await db.ref(`privateMessages/${chatName}/${key}`)

	return data.update({
		read: true
	})
}

	