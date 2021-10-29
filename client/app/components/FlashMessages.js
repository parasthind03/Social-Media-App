import React from 'react'

export default function FlashMessages(props) {
	return (
		<div className="floating-alerts">
			{props.messages.map((message, index) => {
				return (
					<div className="alert alert-success text-center floating-alert shadow-sm">{message}</div>
				)
			})}
		</div>
	)
}
