import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import ServerConfig from "./config/serverConfig";
import roomHandler from "./handlers/roomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET" , "POST"],
    origin: "*",
  },
});

io.on("connection" , (socket) => {
  console.log("New user connected");
  roomHandler(socket); // pass the socket connection to the room handler for room creation and joining
  socket.on("disconnect" , () => {
    console.log("User disconnected");
  });
});

server.listen(ServerConfig.PORT, () => {
  console.log(`Server is up at port ${ServerConfig.PORT}`);
});
