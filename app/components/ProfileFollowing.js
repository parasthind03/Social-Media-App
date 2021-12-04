import Axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'

export default function ProfileFollowing(props) {
  const appState = useContext(StateContext)
	const [isLoading, setIsLoading] = useState(true)
	const [following, setFollowing] = useState([])
	const { username } = useParams()
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function fetchFollowing() {
			try {
				const response = await Axios.get(`/profile/${username}/following`, {
					cancelToken: ourRequest.token
				})
				setFollowing(response.data)
				setIsLoading(false)
			} catch (e) {
				console.log('There was an error')
			}
		}
		fetchFollowing()

		return () => {
			ourRequest.cancel()
		}
	}, [username])

	if (isLoading) return <LoadingDotsIcon />

	return (
		<div className="list-group">
			{following.map((following, index) => {
				return (
					<Link
						key={index}
						to={`/profile/${following.username}`}
						className="list-group-item list-group-item-action">
						<img className="avatar-tiny" src={following.avatar} /> {following.username}
					</Link>
				)
			})}
      {following.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You aren&rsquo;t following anyone yet.</p>}
      {following.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} isn&rsquo;t following anyone yet.</p>}
		</div>
	)
}
