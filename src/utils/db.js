import localForage from 'localforage'

localForage.config()

const updateDB_State = (state) => {
    localForage.setItem('toDoList', state).catch(() => {
        return null
    })
}

const getDB_State = () => {
    return localForage.getItem('toDoList').catch(() => {
        return null
    })
}

const updateDB_JWT = (jwt) => {
    localForage.setItem('jwt', jwt).catch(() => {
        return null
    })
}

const getDB_JWT = () => {
    return localForage.getItem('jwt').catch(() => {
        return null
    })
}

const clearDB = () => {
    localForage.clear().catch(() => {
        return null
    })
}

export { updateDB_State, updateDB_JWT, getDB_JWT, getDB_State, clearDB }
