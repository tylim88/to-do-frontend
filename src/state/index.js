import { Subscribe, Provider } from 'unstated'
import { ToDoContainer } from './toDoState'
import { UserContainer } from './userState'

const toDoContainer = new ToDoContainer()
const userContainer = new UserContainer()

export { Subscribe, Provider, toDoContainer, userContainer }
