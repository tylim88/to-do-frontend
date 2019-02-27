import { Container } from 'unstated'
import { toDoContainer } from '.'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { updateDB_JWT, clearDB } from '../utils/db'

const initState = {
    login: false,
    signUpModal: false,
    loginModal: false,
    username: '',
    email: '',
    password: '',
    validUsername: true,
    validPassword: true,
    validEmail: true,
    message: '',
    usernameMessage: '',
    emailMessage: '',
    passwordMessage: '',
    cancelAble: true,
    loading: false,
    usernameLoading: false,
    emailLoading: false,
}

class UserContainer extends Container {
    state = { ...initState }

    toggleSignUpWindow = () => {
        return this.setState((state) => {
            state = {
                ...state,
                signUpModal: !state.signUpModal,
                cancelAble: true,
                validUsername: true,
                validPassword: true,
                validEmail: true,
                message: '',
                usernameMessage: '',
                emailMessage: '',
                passwordMessage: '',
                loading: false,
                usernameLoading: false,
                emailLoading: false,
                username: '',
                email: '',
                password: '',
            }
            return state
        })
    }

    toggleLoginWindow = () => {
        return this.setState((state) => {
            state = {
                ...state,
                loginModal: !state.loginModal,
                message: '',
                cancelAble: true,
                loading: false,
                username: '',
                email: '',
                password: '',
            }
            return state
        })
    }

    fetchSignUp = () => {
        const {
            state: { username, email, password },
        } = this
        this.setState({
            cancelAble: false,
            loading: true,
            message: 'Please Wait...',
        })

        request
            .post(`${process.env.REACT_APP_URL}signUp`)
            .send({
                username,
                email,
                password,
                state: JSON.stringify(toDoContainer.state),
            })
            .then(
                (res) => {
                    const {
                        body: { access_token },
                    } = res

                    updateDB_JWT(`Bearer ${access_token}`)

                    return this.setState(
                        {
                            message: 'sign up success!',
                            login: true,
                            username: jwt.decode(access_token).identity,
                        },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    cancelAble: true,
                                    loading: false,
                                    signUpModal: false,
                                })
                            }, 2000)
                        }
                    )
                },
                (err) => {
                    return this.setState({
                        loading: false,
                        message:
                            (err.response &&
                                err.response.body &&
                                err.response.body.message) ||
                            'network error',
                        cancelAble: true,
                    })
                }
            )
    }

    fetchLogin = () => {
        const {
            state: { username, password },
        } = this
        this.setState({
            cancelAble: false,
            loading: true,
            message: 'Please Wait...',
        })

        request
            .post(`${process.env.REACT_APP_URL}login`)
            .send({ username, password })
            .then((res) => {
                if (!res.body.access_token) {
                    throw new Error()
                }
                const {
                    body: { access_token, state },
                } = res

                updateDB_JWT(`Bearer ${access_token}`)

                toDoContainer.setAll(state)

                return this.setState(
                    {
                        message: 'login success!',
                        login: 'true',
                        username: jwt.decode(access_token).identity,
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                cancelAble: true,
                                loading: false,
                                loginModal: false,
                            })
                        }, 2000)
                    }
                )
            })
            .catch((err) => {
                return this.setState({
                    loading: false,
                    message:
                        (err.response &&
                            err.response.body &&
                            err.response.body.message) ||
                        'network error',
                    cancelAble: true,
                })
            })
    }

    logout = () => {
        clearDB()

        this.setState({ ...initState })
        toDoContainer.initializeState()
    }

    validateUsername = (username) => {
        this.setState({ usernameLoading: true, validUsername: true, username })
        return request
            .post(`${process.env.REACT_APP_URL}usernameValidation`)
            .send({ username })

            .then(
                (res) => {
                    this.setState({
                        usernameLoading: false,
                        validUsername: true,
                        usernameMessage: res.body.message,
                    })
                },
                (err) => {
                    return this.setState({
                        usernameLoading: false,
                        validUsername: false,
                        usernameMessage:
                            (err.response &&
                                err.response.body &&
                                err.response.body.message) ||
                            'network error',
                    })
                }
            )
    }

    validateEmail = (email) => {
        this.setState({ emailLoading: true, validEmail: true, email })
        return request
            .post(`${process.env.REACT_APP_URL}emailValidation`)
            .send({ email })
            .then(
                (res) => {
                    this.setState({
                        emailLoading: false,
                        validEmail: true,
                        emailMessage: res.body.message,
                    })
                },
                (err) => {
                    return this.setState({
                        emailLoading: false,
                        validEmail: false,
                        emailMessage:
                            (err.response &&
                                err.response.body &&
                                err.response.body.message) ||
                            'network error',
                    })
                }
            )
    }

    validatePassword = (password) => {
        const isValid = password.length > 7
        this.setState({
            password,
            validPassword: isValid,
            passwordMessage: isValid
                ? ''
                : 'length must be at least 8 character',
        })
    }

    clearUsernameError = () => {
        return this.setState({
            validUsername: true,
        })
    }

    clearEmailError = () => {
        return this.setState({
            validEmail: true,
        })
    }

    clearPasswordError = () => {
        return this.setState({
            validPassword: true,
        })
    }

    setUsername = (username) => {
        this.state.username = username
    }
    setEmail = (email) => {
        this.state.email = email
    }

    setPassword = (password) => {
        this.state.password = password
    }
}

export { UserContainer }
