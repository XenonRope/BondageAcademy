import "@abraham/reflection";

import {
  RequestFromClient,
  ServerResponse,
} from "@bondage-academy/bondage-academy-model";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { container } from "tsyringe";
import { AccountApi } from "./account/account-api";
import { LogoutService } from "./account/logout-service";
import { ActionApi } from "./action/action-api";
import { BusinessError } from "./api/model/business-error";
import { CharacterPoseApi } from "./character/character-pose-api";
import { ChatSpeakApi } from "./chat/chat-speak-api";
import { DialogueOptionApi } from "./chat/dialogue-option-api";
import { Logger } from "./log/logger";
import { MigrationService } from "./migration/migration-service";
import { MinigameApi } from "./minigame/minigame-api";
import { MovementApi } from "./movement/movement-api";
import { RoomCreationApi } from "./room/room-creation-api";
import { RoomInitializationService } from "./room/room-initialization-service";
import { RoomJoinApi } from "./room/room-join-api";
import { RoomLeaveApi } from "./room/room-leave-api";
import { RoomSearchApi } from "./room/room-search-api";
import { ScriptService } from "./script/script-service";
import { HeadmistressScript } from "./script/scripts/headmistress-script";
import { SessionService } from "./session/session-service";
import { DatabaseSynchronizationService } from "./synchronization/database-synchronization-service";
import { WardrobeApi } from "./wardrobe/wardrobe-api";

const databaseSynchronizationService = container.resolve(
  DatabaseSynchronizationService,
);
const logoutService = container.resolve(LogoutService);
const migrationService = container.resolve(MigrationService);
const roomInitializationService = container.resolve(RoomInitializationService);
const scriptService = container.resolve(ScriptService);
const scripts = [container.resolve(HeadmistressScript)];
const sessionService = container.resolve(SessionService);
const logger = container.resolve(Logger);
const accountApi = container.resolve(AccountApi);
const actionApi = container.resolve(ActionApi);
const characterPoseApi = container.resolve(CharacterPoseApi);
const chatSpeakApi = container.resolve(ChatSpeakApi);
const dialogueOptionApi = container.resolve(DialogueOptionApi);
const minigameApi = container.resolve(MinigameApi);
const movementApi = container.resolve(MovementApi);
const roomCreationApi = container.resolve(RoomCreationApi);
const roomJoinApi = container.resolve(RoomJoinApi);
const roomLeaveApi = container.resolve(RoomLeaveApi);
const roomSearchApi = container.resolve(RoomSearchApi);
const wardrobeApi = container.resolve(WardrobeApi);

const app = express();
const server = createServer(app);
const io = new Server(server);

const handleRequest = (
  handler: () => Promise<unknown>,
  callback: (response: ServerResponse<unknown>) => void,
): void => {
  handler()
    .then((data) => {
      callback({ data });
    })
    .catch((error) => {
      if (error instanceof BusinessError) {
        logger.warn("BusinessError: " + error.message);
        callback({ error: error.message });
      } else {
        logger.error(
          "Unexpected error: " + (error instanceof Error ? error.stack : error),
        );
        callback({ error: "unexpectedError" });
      }
    });
};

async function start(): Promise<void> {
  await migrationService.migrate();
  await roomInitializationService.initializeRooms();
  databaseSynchronizationService.startSynchronizationLoop();
  scriptService.addScripts(scripts);

  io.on("connection", (socket) => {
    logger.info("User connected");
    const session = sessionService.getSessionBySocket(socket);
    socket.on("disconnect", () => {
      logger.info("User disconnected");
      logoutService.logout(session);
      sessionService.removeSessionWithSocket(socket);
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
        callback,
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
    socket.on(RequestFromClient.LeaveRoom, (_msg: unknown, callback) => {
      handleRequest(() => roomLeaveApi.leaveRoom(session), callback);
    });
    socket.on(RequestFromClient.SearchRoom, (msg: unknown, callback) => {
      handleRequest(() => roomSearchApi.searchRooms(msg), callback);
    });
    socket.on(RequestFromClient.Speak, (msg: unknown, callback) => {
      handleRequest(() => chatSpeakApi.speak(msg, session), callback);
    });
    socket.on(RequestFromClient.UseDialogueOption, (msg: unknown, callback) => {
      handleRequest(
        () => dialogueOptionApi.useDialogueOption(msg, session),
        callback,
      );
    });
    socket.on(RequestFromClient.Wear, (msg: unknown, callback) => {
      handleRequest(() => wardrobeApi.wear(msg, session), callback);
    });
    socket.on(RequestFromClient.CustomizeItem, (msg: unknown, callback) => {
      handleRequest(() => wardrobeApi.customizeItem(msg, session), callback);
    });
    socket.on(RequestFromClient.ChangeProgess, (msg: unknown, callback) => {
      handleRequest(() => minigameApi.changeProgress(msg, session), callback);
    });
    socket.on(RequestFromClient.Action, (msg: unknown, callback) => {
      handleRequest(() => actionApi.executeAction(msg, session), callback);
    });
  });

  server.listen(3000, () => {
    logger.info("server running at http://localhost:3000");
  });
}

start().catch(logger.error.bind(logger));
