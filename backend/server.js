const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const { ACTIONS } = require("./actions");
const { generateFile } = require("./services/generateFile");
const {
  cCodeRunner,
  cppCodeRunner,
  javaCodeRunner,
  pythonCodeRunner,
  jsCodeRunner,
} = require("./services/codeRunner");
const roomRoutes = require("./routes/roomRoutes");
const {mapUserToRoom, getCurrentUser, deleteUser} = require("./services/room.service");

dotenv.config({ path: path.join(__dirname, `./.env`) });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors())


io.on("connection", async (socket) => {
  // Socket: Listening for disconnecting
  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    const user = await getCurrentUser(socket.id);
    rooms.forEach((room) => {
      socket.in(room).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        user
      })
    })
    await deleteUser(socket.id)
    socket.leave()
  });

  // Socket: Listen for Code Run Events
  socket.on(ACTIONS.RUN, async ({ roomId, code, extension = "c" }) => {
    try {
      const filePath = await generateFile(code, extension);
      let output;
      const startedAt = new Date();
      if (extension === "c") output = await cCodeRunner(filePath);
      else if (extension === "cpp") output = await cppCodeRunner(filePath);
      else if (extension === "java") output = await javaCodeRunner(filePath);
      else if (extension === "py") output = await pythonCodeRunner(filePath);
      else if (extension === "js") output = await jsCodeRunner(filePath);

      const endedAt = new Date();
      io.in(roomId).emit(ACTIONS.RETURN, {
        output,
        success: true,
        startedAt,
        endedAt,
      });
    } catch (err) {
      io.in(roomId).emit(ACTIONS.RETURN, {
        output: err,
        success: false,
      });
    }
  });

  // Socket: Listen for Join Event
  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    socket.join(roomId);
    const room = await mapUserToRoom(roomId, username, socket.id);
    const users = room.users;
    const currentUser = await getCurrentUser(socket.id);

    users.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        users,
        currentUser,
        socketId: socket.id,
      });
    });
  });

  // Socket: Listening for code sync
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId }) => { 
      socket.to(roomId).emit(ACTIONS.SYNC_CODE, {
        socketId,
      });
  })

  // Socket: Listening for code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code
    })
  })
});


app.use("/room", roomRoutes);

const connectDataBase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
connectDataBase().then(server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}));
