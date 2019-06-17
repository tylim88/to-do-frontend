import { Container } from 'unstated'
import { userContainer } from '.'
// ! importing other container may introduce circular dependency resulting in undefined import, depending on who first
// ! in stead of passing data to other container here, we should pass it in Login.js
// ! will fix this in future
import request from 'superagent'
import { updateDB_State, getDB_State, getDB_JWT } from '../utils/db'

const initState = {
	todo: [],
	filter: 'All',
	stat: [0, 0, 0], // number of all, active, done
}

class ToDoContainer extends Container {
	state = { ...initState }

	// store state in local storage and database
	updateData = async () => {
		const state = JSON.stringify(this.state)

		const jwt = await getDB_JWT()

		updateDB_State(state)

		if (userContainer.state.login && jwt) {
			request
				.put(`${process.env.REACT_APP_URL}updateItems`)
				.set('Authorization', jwt)
				.send({ state })
				.then(() => {}, () => {})
		}
	}
	// restore data from local storage or database
	// priority database
	initialize = async () => {
		const jwt = await getDB_JWT()

		const cache = await getDB_State()

		if (jwt) {
			request
				.get(`${process.env.REACT_APP_URL}getItems`)
				.set('Authorization', jwt)
				.then(
					res => {
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

	setAll = dbState => {
		updateDB_State(dbState)

		this.setState(() => {
			return JSON.parse(dbState)
		})
	}

	initializeState = () => {
		// some weird bug that cause initState tied to this.state
		// so i created a new one
		const initState = {
			todo: [],
			filter: 'All',
			stat: [0, 0, 0],
		}
		this.setState({ ...initState }, () => {})
	}

	// input add item
	addItem = text => {
		return this.setState(
			state => {
				if (text.length === 0) {
					alert('item is empty')
					return
				}

				const duplicate = state.todo.find(obj => obj.text === text)

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
				this.updateData()
			}
		)
	}
	// toggle item done/active state
	toggleDone = text => {
		return this.setState(
			state => {
				const obj = state.todo.find(obj => obj.text === text)
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
				this.updateData()
			}
		)
	}
	// update item text
	updateText = (text, newText, selfIndex) => {
		return this.setState(
			state => {
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

				const obj = state.todo.find(obj => obj.text === text)
				obj.text = newText
				return state
			},
			() => {
				this.updateData()
			}
		)
	}
	// update filter mode
	updateFilter = filter => {
		return this.setState({ filter })
	}
	// get filtered list
	filteredList = () => {
		return this.state.todo.filter(
			item => {
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
				this.updateData()
			}
		)
	}
	// delete item
	deleteItem = text => {
		return this.setState(
			state => {
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
				this.updateData()
			}
		)
	}
	// clear done item
	clearDone = () => {
		return this.setState(
			state => {
				const done = state.todo.reduce((acc, obj, index) => {
					if (obj.done) {
						acc.push(index)
					}
					return acc
				}, [])
				const indexes = done.reverse()

				indexes.forEach(num => {
					state.todo.splice(num, 1)
				})

				state.stat = [state.todo.length, state.todo.length, 0]
				return state
			},
			() => {
				this.updateData()
			}
		)
	}
}

const toDoContainer = new ToDoContainer()

export { toDoContainer }
