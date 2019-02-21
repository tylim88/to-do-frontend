import React, { Component } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { UserContainer } from '../state'
import { Subscribe } from 'unstated'
import MessageBox from './MessageBox'

class SignUp extends Component {
    render() {
        return (
            <Subscribe to={[UserContainer]}>
                {(user) => {
                    const {
                        state: { loginModal, cancelAble },
                        toggleLoginWindow,
                        fetchLogin,
                        setUsername,
                        setPassword,
                    } = user
                    return (
                        <Modal show={loginModal} onHide={toggleLoginWindow}>
                            <Modal.Dialog>
                                <Modal.Header closeButton={cancelAble}>
                                    <Modal.Title>Login</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>
                                                Username or email
                                            </Form.Label>
                                            <Form.Control
                                                maxLength="64"
                                                type="email"
                                                placeholder="Enter username or email"
                                                onChange={(e) => {
                                                    setUsername(e.target.value)
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                maxLength="128"
                                                type="password"
                                                placeholder="Password"
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                }}
                                            />
                                        </Form.Group>
                                    </Form>
                                    <MessageBox />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        disabled={!cancelAble}
                                        variant="secondary"
                                        onClick={toggleLoginWindow}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            fetchLogin()
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Modal.Footer>
                            </Modal.Dialog>
                        </Modal>
                    )
                }}
            </Subscribe>
        )
    }
}

export default SignUp
