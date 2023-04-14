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

dotenv.config({ path: path.join(__dirname, `./.env`) });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors())

io.on("connection", (socket) => {
  socket.on(ACTIONS.RUN, async ({ code, extension = "c" }) => {
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
      io.to(socket.id).emit(ACTIONS.RETURN, {
        output,
        success: true,
        startedAt,
        endedAt,
      });
    } catch (err) {
      io.to(socket.id).emit(ACTIONS.RETURN, {
        output: err,
        success: false,
      });
    }
  });
});

app.use('/room', roomRoutes);

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
