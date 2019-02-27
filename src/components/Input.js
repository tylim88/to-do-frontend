import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { Subscribe } from 'unstated'
import { ToDoContainer } from '../state'

class Input extends React.Component {
    onSubmitText = (toDo) => {
        toDo.addItem(this.input.value)
        this.input.value = ''
    }
    render() {
        const { onSubmitText } = this
        return (
            <Subscribe to={[ToDoContainer]}>
                {(toDo) => (
                    <InputGroup
                        // container
                        className="mb-3 input-group-customize size-device"
                    >
                        <FormControl
                            // input field
                            placeholder="Click Insert or Press Enter to add Item"
                            ref={(ref) => (this.input = ref)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSubmitText(toDo)
                                }
                            }}
                            aria-label="insert your item here"
                        />
                        <InputGroup.Append>
                            <Button
                                // insert button
                                variant="warning"
                                onClick={() => {
                                    onSubmitText(toDo)
                                }}
                            >
                                Insert
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                )}
            </Subscribe>
        )
    }
}

export default Input
