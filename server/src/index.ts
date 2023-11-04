import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { accountApi } from "./account/AccountApi";
import { type ServerResponse } from "./common/model/ServerResponse";
import { sessionService } from "./session/SessionService";

const app = express();
const server = createServer(app);
const io = new Server(server);

const handleRequest = (
  handler: () => Promise<unknown>,
  callback: (response: ServerResponse<unknown>) => void
): void => {
  handler()
    .then((data) => {
      callback({ data });
    })
    .catch((error) => {
      callback({
        error: error instanceof Error ? error.message : error.toString(),
      });
    });
};

io.on("connection", (socket) => {
  console.log("User connected");
  const session = sessionService.getSessionBySocket(socket);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("register_account", (msg, callback) => {
    handleRequest(() => accountApi.registerAccount(msg), callback);
  });
  socket.on("login", async (msg, callback) => {
    handleRequest(() => accountApi.login(msg, session), callback);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
