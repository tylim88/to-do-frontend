import React, { Component } from 'react'
import ListItem from './ListItem'
import { Subscribe } from 'unstated'
import { ToDoContainer } from '../state'

class List extends Component {
    render() {
        return (
            <Subscribe to={[ToDoContainer]}>
                {(toDo) => (
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
