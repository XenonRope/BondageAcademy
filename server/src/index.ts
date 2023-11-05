import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { accountApi } from "./account/AccountApi";
import { logoutService } from "./account/LogoutService";
import { BusinessError } from "./common/model/BusinessError";
import { type ServerResponse } from "./common/model/ServerResponse";
import { movementApi } from "./movement/MovementApi";
import { roomInitializationService } from "./room/RoomInitializationService";
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
      if (error instanceof BusinessError) {
        console.log("BusinessError: " + error.message);
        callback({ error: error.message });
      } else {
        console.log(
          "Unexpected error: " + (error instanceof Error ? error.stack : error)
        );
        callback({ error: "unexpectedError" });
      }
    });
};

roomInitializationService.initializeRooms().catch((error) => {
  console.log("Error while initializing rooms: " + error);
});

io.on("connection", (socket) => {
  console.log("User connected");
  const session = sessionService.getSessionBySocket(socket);
  socket.on("disconnect", () => {
    console.log("User disconnected");
    logoutService.logout(session);
  });
  socket.on("register_account", (msg, callback) => {
    handleRequest(() => accountApi.registerAccount(msg), callback);
  });
  socket.on("login", async (msg, callback) => {
    handleRequest(() => accountApi.login(msg, session), callback);
  });
  socket.on("set_player_target_position", async (msg, callback) => {
    handleRequest(
      () => movementApi.setPlayerTargetPosition(msg, session),
      callback
    );
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
