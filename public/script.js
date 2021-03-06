
  window.navigator.getUserMedia = function() {
    webkit.messageHandlers.callbackHandler.postMessage("Please provide acess");
  }

const socket = io('/', { transports: ['polling'] });
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer({
  host: '9000-f6bf939c-3246-478a-be43-e0e8ef07d808.ws-us02.gitpod.io',
  secure: true
})
let myVideo = document.createElement('video')
myVideo.muted = true
let peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addLocalVideo(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    let video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.setAttribute("height", "650");
  video.setAttribute("width", "100%");
  document.getElementById("remoteVideo").appendChild(video);
}

function addLocalVideo(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.setAttribute("height", "180");
  video.setAttribute("width", "120");
  document.getElementById("localVideo").appendChild(video);
}