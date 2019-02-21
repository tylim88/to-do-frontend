import { Container } from 'unstated'
import { userContainer } from '.'
import request from 'superagent'

const initState = {
    todo: [],
    filter: 'All',
    stat: [0, 0, 0], // number of all, active, done
}

class ToDoContainer extends Container {
    state = initState

    // store state in local storage and database
    storeData = async () => {
        const state = JSON.stringify(this.state)
        const jwt = localStorage.getItem('jwt')
        localStorage.setItem('toDoList', state)
        if (userContainer.state.login && jwt) {
            request
                .post('http://127.0.0.1:5000/updateItems')
                .set('Authorization', jwt)
                .send({ state })
                .then(() => {}, () => {})
        }
    }
    // restore data from local storage or database
    // priority database
    initialize = async () => {
        const jwt = localStorage.getItem('jwt')
        const cache = localStorage.getItem('toDoList')
        if (jwt) {
            await request
                .get('http://127.0.0.1:5000/getItems')
                .set('Authorization', jwt)
                .then(
                    (res) => {
                        const {
                            body: { username, state },
                        } = res
                        this.setAll(state)
                        userContainer.setState({
                            login: true,
                            username,
                        })
                    },
                    () => {
                        if (cache) {
                            this.setAll(cache)
                        }
                    }
                )
        } else {
            if (cache) {
                this.setAll(cache)
            }
        }
    }

    setAll = (dbState) => {
        localStorage.setItem('toDoList', dbState)
        this.setState(() => {
            return JSON.parse(dbState)
        })
    }

    initializeState = () => {
        this.setState({ ...initState })
    }

    // input add item
    addItem = (text) => {
        return this.setState(
            (state) => {
                if (text.length === 0) {
                    alert('item is empty')
                    return
                }

                const duplicate = state.todo.find((obj) => obj.text === text)

                if (duplicate) {
                    alert('similar item already existed')
                    return
                }
                state.todo.push({ text, done: false })
                state.stat[0] = state.stat[0] + 1
                state.stat[1] = state.stat[1] + 1

                return state
            },
            () => {
                this.storeData()
            }
        )
    }
    // toggle item done/active state
    toggleDone = (text) => {
        return this.setState(
            (state) => {
                const obj = state.todo.find((obj) => obj.text === text)
                obj.done = !obj.done

                if (obj.done) {
                    state.stat[1] = state.stat[1] - 1
                    state.stat[2] = state.stat[2] + 1
                } else {
                    state.stat[1] = state.stat[1] + 1
                    state.stat[2] = state.stat[2] - 1
                }

                return state
            },
            () => {
                this.storeData()
            }
        )
    }
    // update item text
    updateText = (text, newText, selfIndex) => {
        return this.setState(
            (state) => {
                if (newText.length === 0) {
                    alert('item is empty')
                    return
                }
                const duplicate = state.todo.reduce((acc, { text }, index) => {
                    if (text === newText) {
                        acc.push(index)
                    }
                    return acc
                }, [])
                if (
                    duplicate.length > 1 ||
                    (duplicate.length === 1 && duplicate[0] !== selfIndex)
                ) {
                    alert('similar item already existed')
                    return
                }

                const obj = state.todo.find((obj) => obj.text === text)
                obj.text = newText
                return state
            },
            () => {
                this.storeData()
            }
        )
    }
    // update filter mode
    updateFilter = (filter) => {
        return this.setState({ filter })
    }
    // get filtered list
    filteredList = () => {
        return this.state.todo.filter(
            (item) => {
                if (this.state.filter === 'All') {
                    return true
                } else if (this.state.filter === 'Active' && !item.done) {
                    return true
                } else if (this.state.filter === 'Done' && item.done) {
                    return true
                } else {
                    return false
                }
            },
            () => {
                this.storeData()
            }
        )
    }
    // delete item
    deleteItem = (text) => {
        return this.setState(
            (state) => {
                state.todo.some((obj, index) => {
                    if (obj.text === text) {
                        state.todo.splice(index, 1)
                        return true
                    }
                    return false
                })
                return state
            },
            () => {
                this.storeData()
            }
        )
    }
    // clear done item
    clearDone = () => {
        return this.setState(
            (state) => {
                const done = state.todo.reduce((acc, obj, index) => {
                    if (obj.done) {
                        acc.push(index)
                    }
                    return acc
                }, [])
                const indexes = done.reverse()

                indexes.forEach((num) => {
                    state.todo.splice(num, 1)
                })

                state.stat = [state.todo.length, state.todo.length, 0]
                return state
            },
            () => {
                this.storeData()
            }
        )
    }
}

export { ToDoContainer }
