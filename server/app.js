const express = require('express')
const app = express()
const sanitizeHTML = require('sanitize-html')
const jwt = require('jsonwebtoken')
const {Server} = require('socket.io')
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', require('./router'))

const server = require('http').createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
    credentials: true,
    allowEIO3: true
	}
})

io.on('connection', (socket) => {
	socket.on('chatFromBrowser', (data) => {
		try {
			let user = jwt.verify(data.token, process.env.JWTSECRET)
			socket.broadcast.emit('chatFromServer', {
				message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }),
				username: user.username,
				avatar: user.avatar
			})
		} catch (e) {
			console.log('Not a valid token for chat.')
		}
	})
})

module.exports = server
