export const getTime = timestamp => {
    const time = new Date(timestamp)
    const hours = time.getHours()
    const minutes = time.getMinutes()

    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
}


export const checkBottomPos = el => 
    el.scrollTop + el.offsetHeight === el.scrollHeight

export const scrollBottom = el => 
    el.scrollTop = el.scrollHeight 


export const getValueByProp = (propertyName, value) => () => ({
        [propertyName]: value,
    })

export const getUserStatusText = (user) => {
    if(user.connections) return 'Здесь'
		
    if(user.lastOnline) {
        const lastVisit = new Date(user.lastOnline)
        const year = lastVisit.getFullYear()
        const month = lastVisit.getMonth() + 1
        const date = lastVisit.getDate()
        const hours = lastVisit.getHours()
        const minutes = lastVisit.getMinutes()

        const now = new Date()
        const diff = now - lastVisit
        const dayInMs = 1000*60*60*24

        if (diff < dayInMs) return `Отсутствует с ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
        
        if (diff > dayInMs && diff < dayInMs*2) return `Вчера видели в ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
        
        if (diff > dayInMs*2) return `Не слышно с ${date < 10 ? '0' + date : date}.${month < 10 ? '0'+ month : month}.${year.toString().slice(-2)}`
    }
}

export const getUserStatusClass = user => {
    return user.connections ? 'online' : 'offline'
}

export const isValidForm = (fields, validationFn) => {
    return fields.some(validationFn)
}
