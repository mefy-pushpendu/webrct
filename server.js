const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer');

app.set('view engine', 'ejs')
app.use('/static',express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/room/${uuidV4()}`)
})

app.get('/room/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})


const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/id'
});

app.use('/peerjs', peerServer);

server.listen(3000)