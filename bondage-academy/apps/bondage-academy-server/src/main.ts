import {
  RequestFromClient,
  ServerResponse,
} from "@bondage-academy/bondage-academy-model";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { BusinessError } from "./api/model/business-error";
import {
  accountApi,
  characterPoseApi,
  movementApi,
  roomCreationApi,
  roomJoinApi,
} from "./app/api";
import {
  databaseSynchronizationService,
  logoutService,
  migrationService,
  roomInitializationService,
  sessionService,
} from "./app/services";

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

async function start(): Promise<void> {
  await migrationService.migrate();
  await roomInitializationService.initializeRooms();
  databaseSynchronizationService.startSynchronizationLoop();

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
    socket.on("login", (msg, callback) => {
      handleRequest(() => accountApi.login(msg, session), callback);
    });
    socket.on("set_player_target_position", (msg, callback) => {
      handleRequest(
        () => movementApi.setPlayerTargetPosition(msg, session),
        callback
      );
    });
    socket.on("change_pose", (msg, callback) => {
      handleRequest(() => characterPoseApi.changePose(msg, session), callback);
    });
    socket.on(RequestFromClient.JoinRoom, (msg: unknown, callback) => {
      handleRequest(() => roomJoinApi.joinRoom(msg, session), callback);
    });
    socket.on(RequestFromClient.CreateRoom, (msg: unknown, callback) => {
      handleRequest(() => roomCreationApi.createRoom(msg, session), callback);
    });
  });

  server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
  });
}

start().catch(console.log);
