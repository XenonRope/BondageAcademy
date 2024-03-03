import {
  EventFromServer,
  GameObject,
  ObjectType,
  Player,
  PlayerObject,
  Room,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Socket } from "socket.io";
import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerService } from "../player/player-service";
import { RoomService } from "../room/room-service";
import { SessionService } from "../session/session-service";
import { ChatSpeakService } from "./chat-speak-service";
import { setupContainer } from "../test/setup-container";

const PLAYER_ID = 1;
const PLAYER_NAME = "Alice";
const ROOM_ID = 10;

let chatSpeakService: ChatSpeakService;
let playerService: PlayerService;
let roomService: RoomService;
let sessionService: SessionService;
let socket: Socket;

beforeEach(() => {
  setupContainer();

  playerService = mock(PlayerService);
  roomService = mock(RoomService);
  sessionService = mock(SessionService);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(RoomService, roomService);
  container.registerInstance(SessionService, sessionService);
  chatSpeakService = container.resolve(ChatSpeakService);
  socket = mock(Socket);
});

describe("speak", () => {
  test("Send chat message to all players in room", async () => {
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({
        id: PLAYER_ID,
        name: PLAYER_NAME,
        roomId: ROOM_ID,
      } as Player);
    when(roomService.getRoomById)
      .calledWith(ROOM_ID)
      .mockResolvedValue({
        id: ROOM_ID,
        objects: [
          { type: ObjectType.Player, playerId: PLAYER_ID } as PlayerObject,
        ] as GameObject[],
      } as Room);
    when(sessionService.getSessionByPlayerId)
      .calledWith(PLAYER_ID)
      .mockReturnValue({ socket });

    await chatSpeakService.speak(PLAYER_ID, "Hello!");

    expect(socket.emit).toHaveBeenCalledWith(
      EventFromServer.ChatMessage,
      expect.objectContaining({
        message: expect.objectContaining({
          speaker: PLAYER_NAME,
          content: "Hello!",
        }),
      }),
    );
  });
});
