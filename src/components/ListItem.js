import React, { Component } from 'react'
import { InputGroup, Button, Form } from 'react-bootstrap'

class ListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteButton: false,
            editMode: false,
            input: this.props.text,
        }
    }

    saveChange = (text, input, toDo, index) => {
        toDo.updateText(text, input, index)
        this.setState({ editMode: false })
    }

    initializeInput = (input, text) => {
        if (input !== text) {
            // need this or else it is harder to modify input field
            this.setState({ input: text })
        }
    }

    render() {
        const {
            state: { deleteButton, editMode, input },
            props: { toDo, text, done, index },
            saveChange,
            initializeInput,
        } = this
        return (
            <>
                <InputGroup
                    // container
                    className="mb-1"
                    onMouseEnter={() => {
                        this.setState({ deleteButton: true })
                    }}
                    onMouseLeave={() => {
                        this.setState({ deleteButton: false })
                    }}
                >
                    {editMode ? (
                        <Form.Control
                            // editable input
                            as="input"
                            rows="1"
                            ref={(ref) => {
                                this.input = ref
                                this.input && this.input.focus()
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveChange(text, input, toDo, index)
                                } else if (e.key === 'Escape') {
                                    this.setState({ editMode: false })
                                }
                            }}
                            onBlur={() => {
                                saveChange(text, input, toDo, index)
                            }}
                            onChange={(e) =>
                                // this input value only change with onChange
                                this.setState({ input: e.target.value })
                            }
                            value={
                                // this input value only change with onChange
                                input
                            }
                            className="list-item"
                        />
                    ) : (
                        <>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    {index + 1}
                                </InputGroup.Text>
                                <InputGroup.Checkbox
                                    aria-label="Checkbox for following text input"
                                    onChange={() => {
                                        toDo.toggleDone(text)
                                    }}
                                    checked={done}
                                />
                            </InputGroup.Prepend>
                            {/* 
                            this component is bugged!
                            need feedback to react bootstrap
                            <Form.Control
                                plaintext
                                readOnly
                                defaultValue={this.state.input}
                                ref={() => {}}
                                className={
                                    'list-item-label ' +
                                    (done && 'list-item-done')
                                }
                                onMouseEnter={() => {
                                    this.setState({ deleteButton: true })
                                }}
                                onMouseLeave={() => {
                                    this.setState({ deleteButton: false })
                                }}
                                onDoubleClick={() => {
                                    this.setState({ editMode: true })
                                }}
                            /> */}
                            <input
                                // disabled input, basically a label
                                disabled
                                readOnly
                                type="text"
                                className={
                                    'list-item-label form-control ' +
                                    (done && 'list-item-done')
                                }
                                aria-label="Text input with checkbox"
                                value={text}
                                onDoubleClick={() => {
                                    initializeInput(input, text)
                                    this.setState({ editMode: true })
                                }}
                            />
                            {deleteButton && (
                                <Button
                                    // remove this item
                                    variant="outline-danger"
                                    className="button-delete"
                                    onClick={() => {
                                        toDo.deleteItem(text)
                                    }}
                                    onMouseEnter={() => {
                                        this.setState({ deleteButton: true })
                                    }}
                                >
                                    x
                                </Button>
                            )}
                        </>
                    )}
                </InputGroup>
            </>
        )
    }
}

export default ListItem
