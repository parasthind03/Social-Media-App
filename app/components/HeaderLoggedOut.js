import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'

export default function HeaderLoggedOut(props) {
	const appDispatch = useContext(DispatchContext)
	const [username, setUsername] = useState()
	const [password, setPassword] = useState()

	const handleSubmit = async e => {
		e.preventDefault()

		try {
			const response = await Axios.post('/login', { username, password })
			if (response.data) {
				appDispatch({ type: 'login', data: response.data })
				appDispatch({ type: 'flashMessage', value: 'You have successfully Logged In.' })
			} else {
				appDispatch({type: 'flashMessage', value: 'Invalid email or password!'})
			}
		} catch (e) {
			console.log('There was a problem!')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
			<div className="row align-items-center">
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input
						onChange={e => {
							setUsername(e.target.value)
						}}
						name="username"
						className="form-control form-control-sm input-dark"
						type="text"
						placeholder="Username"
						autoComplete="off"
					/>
				</div>
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input
						onChange={e => {
							setPassword(e.target.value)
						}}
						name="password"
						className="form-control form-control-sm input-dark"
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className="col-md-auto">
					<button className="btn btn-success btn-sm">Sign In</button>
				</div>
			</div>
		</form>
	)
}
