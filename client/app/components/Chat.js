import React, { useContext, useEffect, useRef } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'

export default function Chat() {
  const socket = useRef(null)
	const chatField = useRef(null)
	const chatLog = useRef(null)
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const [state, setState] = useImmer({
		fieldValue: '',
		chatMessages: []
	})

	useEffect(() => {
		if (appState.isChatOpen) {
			chatField.current.focus()
      appDispatch({type: 'clearUnreadChatCount'})
		}
	}, [appState.isChatOpen])

  useEffect(() => {
    socket.current = io(process.env.BACKENDURL || "https://backendformycomplexreactapp1.herokuapp.com")

    socket.current.on('chatFromServer', message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })

    return () => socket.current.disconnect()
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if(state.chatMessages.length && !appState.isChatOpen){
      appDispatch({type: 'incrementUnreadChatCount'})
    }
  }, [state.chatMessages])

	function handleFieldChange(e) {
		const value = e.target.value
		setState(draft => {
			draft.fieldValue = value
		})
	}

	function handleSubmit(e) {
		e.preventDefault()
		//Send message to server
    socket.current.emit('chatFromBrowser', {message: state.fieldValue, token: appState.user.token})

		setState(draft => {
			// Add message to the state
			draft.chatMessages.push({
				message: state.fieldValue,
				username: appState.user.username,
				avatar: appState.user.avatar
			})
			draft.fieldValue = ''
		})
	}

	return (
		<div
			id="chat-wrapper"
			className={
				'chat-wrapper shadow border-top border-left border-right ' +
				(appState.isChatOpen ? 'chat-wrapper--is-visible' : '')
			}>
			<div className="chat-title-bar bg-primary">
				Chat
				<span onClick={() => appDispatch({ type: 'closeChat' })} className="chat-title-bar-close">
					<i className="fas fa-times-circle"></i>
				</span>
			</div>
			<div id="chat" className="chat-log" ref={chatLog}>
				{state.chatMessages.map((msg, index) => {
					if (msg.username == appState.user.username) {
						return (
							<div key={index} className="chat-self">
								<div className="chat-message">
									<div className="chat-message-inner">{msg.message}</div>
								</div>
								<img className="chat-avatar avatar-tiny" src={msg.avatar} />
							</div>
						)
					}

					return (
						<div key={index} className="chat-other">
							<Link to={`/profile/${msg.username}`}>
								<img
									className="avatar-tiny"
									src={msg.avatar}
								/>
							</Link>
							<div className="chat-message">
								<div className="chat-message-inner">
									<Link to={`/profile/${msg.username}`}>
										<strong>{msg.username}: </strong>
									</Link>
									{msg.message}
								</div>
							</div>
						</div>
					)
				})}
			</div>
			<form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
				<input
					value={state.fieldValue}
					ref={chatField}
					onChange={handleFieldChange}
					type="text"
					className="chat-field"
					id="chatField"
					placeholder="Type a message…"
					autoComplete="off"
				/>
			</form>
		</div>
	)
}
