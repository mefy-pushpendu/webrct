const { ExpressPeerServer } = require('peer');
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const server = app.listen(9000);
const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    generateClientId: customGenerationFunction
});

app.use('/peerjs', peerServer);

