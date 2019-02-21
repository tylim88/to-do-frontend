import React, { Component } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { UserContainer } from '../state'
import { Subscribe } from 'unstated'
import PulseLoader from 'react-spinners/PulseLoader'
import MessageBox from './MessageBox'

class SignUp extends Component {
    render() {
        return (
            <Subscribe to={[UserContainer]}>
                {(user) => {
                    const {
                        state: {
                            signUpModal,
                            validUsername,
                            validPassword,
                            validEmail,
                            cancelAble,
                            usernameLoading,
                            emailLoading,
                            usernameMessage,
                            emailMessage,
                            passwordMessage,
                            username,
                            email,
                            password,
                        },
                        fetchSignUp,
                        toggleSignUpWindow,
                        validateUsername,
                        validatePassword,
                        validateEmail,
                        setUsername,
                        setPassword,
                        setEmail,
                    } = user

                    return (
                        <Modal show={signUpModal} onHide={toggleSignUpWindow}>
                            <Modal.Dialog>
                                <Modal.Header closeButton={cancelAble}>
                                    <Modal.Title>Sign Up</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="">
                                            <Form.Label>Username</Form.Label>
                                            <InputGroup.Prepend>
                                                <Form.Control
                                                    maxLength="20"
                                                    name="name"
                                                    autoComplete="name"
                                                    placeholder="At least 3 characters."
                                                    onChange={(e) => {
                                                        const username =
                                                            e.target.value
                                                        setUsername(username)
                                                        this.usernameTimeOut &&
                                                            clearTimeout(
                                                                this
                                                                    .usernameTimeOut
                                                            )
                                                        this.usernameTimeOut = setTimeout(
                                                            () => {
                                                                validateUsername(
                                                                    username
                                                                )
                                                            },
                                                            1000
                                                        )
                                                    }}
                                                />
                                                {!validUsername && (
                                                    <Form.Text className="signUp-wrong">
                                                        X
                                                    </Form.Text>
                                                )}

                                                <PulseLoader
                                                    sizeUnit={'px'}
                                                    size={10}
                                                    color={'#123abc'}
                                                    loading={usernameLoading}
                                                />
                                            </InputGroup.Prepend>
                                            <Form.Text className="text-muted">
                                                {usernameMessage}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Email</Form.Label>
                                            <InputGroup.Prepend>
                                                <Form.Control
                                                    maxLength="64"
                                                    type="email"
                                                    placeholder="email"
                                                    onChange={(e) => {
                                                        const email =
                                                            e.target.value
                                                        setEmail(email)
                                                        this.emailTimeOut &&
                                                            clearTimeout(
                                                                this
                                                                    .emailTimeOut
                                                            )
                                                        this.emailTimeOut = setTimeout(
                                                            () => {
                                                                validateEmail(
                                                                    email
                                                                )
                                                            },
                                                            1000
                                                        )
                                                    }}
                                                />
                                                {!validEmail && (
                                                    <Form.Text className="signUp-wrong">
                                                        X
                                                    </Form.Text>
                                                )}
                                                <PulseLoader
                                                    sizeUnit={'px'}
                                                    size={10}
                                                    color={'#123abc'}
                                                    loading={emailLoading}
                                                />
                                            </InputGroup.Prepend>
                                            <Form.Text className="text-muted">
                                                {emailMessage}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup.Prepend>
                                                <Form.Control
                                                    maxLength="128"
                                                    type="password"
                                                    placeholder="At least 8 characters."
                                                    onChange={(e) => {
                                                        const password =
                                                            e.target.value
                                                        setPassword(password)
                                                        this.passwordTimeOut &&
                                                            clearTimeout(
                                                                this
                                                                    .passwordTimeOut
                                                            )
                                                        this.passwordTimeOut = setTimeout(
                                                            () => {
                                                                validatePassword(
                                                                    password
                                                                )
                                                            },
                                                            1000
                                                        )
                                                    }}
                                                />
                                                {!validPassword && (
                                                    <Form.Text className="signUp-wrong">
                                                        X
                                                    </Form.Text>
                                                )}
                                            </InputGroup.Prepend>
                                            <Form.Text className="text-muted">
                                                {passwordMessage}
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        disabled={!cancelAble}
                                        variant="secondary"
                                        onClick={toggleSignUpWindow}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={
                                            username === '' ||
                                            password === '' ||
                                            email === '' ||
                                            !validPassword ||
                                            !validUsername ||
                                            !validEmail ||
                                            emailLoading ||
                                            usernameLoading
                                        }
                                        variant="primary"
                                        onClick={() => {
                                            fetchSignUp()
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Modal.Footer>
                                <Modal.Footer>
                                    <MessageBox />
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
