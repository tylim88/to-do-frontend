import React, { Component } from 'react'
import { Subscribe, userContainer } from '../state'
import { Form, InputGroup } from 'react-bootstrap'
import { css } from '@emotion/core'
import MoonLoader from 'react-spinners/MoonLoader'

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`

class MessageBox extends Component {
	render() {
		return (
			<Subscribe to={[userContainer]}>
				{user => {
					const {
						state: { message, loading },
					} = user
					return (
						<InputGroup.Prepend>
							<Form.Text className="text-muted message">{message}</Form.Text>
							<MoonLoader
								css={override}
								sizeUnit={'px'}
								size={30}
								color={'#123abc'}
								loading={loading}
							/>
						</InputGroup.Prepend>
					)
				}}
			</Subscribe>
		)
	}
}

export default MessageBox
