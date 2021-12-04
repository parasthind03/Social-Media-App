import Axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'

export default function ProfileFollowers(props) {
  const appState = useContext(StateContext)
	const [isLoading, setIsLoading] = useState(true)
	const [followers, setFollowers] = useState([])
	const { username } = useParams()
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function fetchFollowers() {
			try {
				const response = await Axios.get(`/profile/${username}/followers`, {
					cancelToken: ourRequest.token
				})
				setFollowers(response.data)
				setIsLoading(false)
			} catch (e) {
				console.log('There was an error')
			}
		}
		fetchFollowers()

		return () => {
			ourRequest.cancel()
		}
	}, [username])

	if (isLoading) return <LoadingDotsIcon />

	return (
		<div className="list-group">
			{followers.map((follower, index) => {
				return (
					<Link
						key={index}
						to={`/profile/${follower.username}`}
						className="list-group-item list-group-item-action">
						<img className="avatar-tiny" src={follower.avatar} /> {follower.username}
					</Link>
				)
			})}
			{followers.length == 0 && appState.user.username == username && (
				<p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>
			)}
			{followers.length == 0 && appState.user.username != username && (
				<p className="lead text-muted text-center">
					{username} doesn&rsquo;t have any followers yet.
					{appState.loggedIn && ' Be the first to follow them!'}
					{!appState.loggedIn && (
						<>
							{' '}
							If you want to follow them you need to <Link to="/">sign up</Link> for an account
							first.{' '}
						</>
					)}
				</p>
			)}
		</div>
	)
}
