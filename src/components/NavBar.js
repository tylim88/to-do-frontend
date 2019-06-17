import React, { Component } from 'react'
import { Navbar, ButtonToolbar, Button } from 'react-bootstrap'
import { Subscribe, userContainer } from '../state'

class NavBar extends Component {
	render() {
		return (
			<Subscribe to={[userContainer]}>
				{user => {
					const {
						state: { username, login },
						toggleSignUpWindow,
						toggleLoginWindow,
						logout,
					} = user
					return (
						<Navbar bg="dark" className="nav size-device">
							{login && (
								<Navbar.Brand href="#home" className="welcome-text">
									{`${username}, Welcome!`}
								</Navbar.Brand>
							)}
							<Navbar.Collapse className="justify-content-end">
								<ButtonToolbar>
									{login ? (
										<Button
											className="nav-button"
											variant="outline-primary"
											onClick={() => {
												logout()
											}}>
											Sign Out
										</Button>
									) : (
										<>
											<Button
												className="nav-button"
												variant="primary"
												onClick={() => {
													toggleSignUpWindow()
												}}>
												Sign Up
											</Button>
											<Button
												className="nav-button"
												variant="danger"
												onClick={() => {
													toggleLoginWindow()
												}}>
												Login
											</Button>
										</>
									)}
								</ButtonToolbar>
							</Navbar.Collapse>
						</Navbar>
					)
				}}
			</Subscribe>
		)
	}
}

export default NavBar
