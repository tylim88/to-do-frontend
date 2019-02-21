import { Container } from 'unstated'
import { toDoContainer } from '.'
import request from 'superagent'
import jwt from 'jsonwebtoken'

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

    fetchSignUp = async () => {
        const {
            state: { username, email, password },
        } = this
        this.setState({
            cancelAble: false,
            loading: true,
            message: 'Please Wait...',
        })

        await request
            .post('http://127.0.0.1:5000/signUp')
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

                    localStorage.setItem('jwt', `Bearer ${access_token}`)

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

    fetchLogin = async () => {
        const {
            state: { username, password },
        } = this
        this.setState({
            cancelAble: false,
            loading: true,
            message: 'Please Wait...',
        })

        await request
            .post('http://127.0.0.1:5000/login')
            .send({ username, password })
            .then(
                (res) => {
                    const {
                        body: { access_token, state },
                    } = res

                    localStorage.setItem('jwt', `Bearer ${access_token}`)
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

    logout = () => {
        localStorage.clear()
        this.setState({ ...initState })
        toDoContainer.initializeState()
    }

    validateUsername = async (username) => {
        this.setState({ usernameLoading: true, validUsername: true, username })
        return request
            .post(`http://127.0.0.1:5000/usernameValidation`)
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

    validateEmail = async (email) => {
        this.setState({ emailLoading: true, validEmail: true, email })
        return request
            .post(`http://127.0.0.1:5000/emailValidation`)
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

    setUsername = async (username) => {
        this.state.username = username
    }
    setEmail = async (email) => {
        this.state.email = email
    }

    setPassword = async (password) => {
        this.state.password = password
    }
}

export { UserContainer }
