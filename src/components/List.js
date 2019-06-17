import React, { Component } from 'react'
import ListItem from './ListItem'
import { Subscribe, toDoContainer } from '../state'

class List extends Component {
	render() {
		return (
			<Subscribe to={[toDoContainer]}>
				{toDo => (
					<>
						{toDo.filteredList().map(({ text, done }, index) => {
							return (
								<ListItem
									// dynamically generate the list items
									key={index}
									index={index}
									text={text}
									done={done}
									toDo={toDo}
								/>
							)
						})}
					</>
				)}
			</Subscribe>
		)
	}
}

export default List
