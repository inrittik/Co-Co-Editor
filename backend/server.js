const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const {ACTIONS} = require('./actions')

dotenv.config({ path: path.join(__dirname, `./.env`) });

const app = express();
const server = http.createServer(app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on(ACTIONS.RUN, ({code, extension}) => {
        console.log(code, extension)
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})