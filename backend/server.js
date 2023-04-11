const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const { ACTIONS } = require('./actions')
const { generateFile } = require("./services/generateFile");
const { cCodeRunner } = require('./services/codeRunner');

dotenv.config({ path: path.join(__dirname, `./.env`) });

const app = express();
const server = http.createServer(app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on(ACTIONS.RUN, async ({code, extension="c"}) => {
        try {
            const filePath = await generateFile(code, extension);
            const output = await cCodeRunner(filePath)

            console.log(output)
            io.to(socket.id).emit(ACTIONS.RETURN, {
                output
            })
        }
        catch (err) {
            io.to(socket.id).emit(ACTIONS.RETURN, {
              output: err,
            });
        }
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})