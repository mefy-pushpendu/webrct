const { ExpressPeerServer } = require('peer');
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const server = app.listen(9000);
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);

