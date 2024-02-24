import {
  Action,
  ActionType,
  EventFromServer,
  GameObject,
  ObjectType,
  Player,
  PlayerObject,
  Room,
  SmileAction,
  TargetType,
  prepareActorByPlayerId,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Socket } from "socket.io";
import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerService } from "../../player/player-service";
import { RoomService } from "../../room/room-service";
import { SessionService } from "../../session/session-service";
import { SmileActionHandler } from "./smile-action-handler";

const PLAYER_ID = 1;
const PLAYER_NAME = "Alice";
const ROOM_ID = 10;

let smileActionHandler: SmileActionHandler;
let sessionService: SessionService;
let playerService: PlayerService;
let roomService: RoomService;
let socket: Socket;

beforeEach(() => {
  container.clearInstances();

  playerService = mock(PlayerService);
  roomService = mock(RoomService);
  sessionService = mock(SessionService);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(RoomService, roomService);
  container.registerInstance(SessionService, sessionService);
  smileActionHandler = container.resolve(SmileActionHandler);
  socket = mock(Socket);
});

describe("canHandle", () => {
  test("Return true if action is Smile", () => {
    const action: Action = {
      type: ActionType.Smile,
      target: undefined,
    };

    expect(smileActionHandler.canHandle(action)).toBe(true);
  });

  test("Return false if action is not Smile", () => {
    const action: Action = {
      type: ActionType.LookAt,
      target: { type: TargetType.Player, playerId: 1 },
    };

    expect(smileActionHandler.canHandle(action)).toBe(false);
  });
});

describe("handle", () => {
  test("Send chat message to all players in room", async () => {
    const actor = prepareActorByPlayerId(PLAYER_ID);
    const action: SmileAction = {
      type: ActionType.Smile,
      target: undefined,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({ name: PLAYER_NAME, roomId: ROOM_ID } as Player);
    when(roomService.getRoomById)
      .calledWith(ROOM_ID)
      .mockResolvedValue({
        objects: [
          { type: ObjectType.Player, playerId: PLAYER_ID } as PlayerObject,
        ] as GameObject[],
      } as Room);
    when(sessionService.getSessionByPlayerId)
      .calledWith(PLAYER_ID)
      .mockReturnValue({ socket });

    await smileActionHandler.handle(actor, action);

    expect(socket.emit).toHaveBeenCalledWith(
      EventFromServer.ChatMessage,
      expect.objectContaining({
        message: expect.objectContaining({
          action: true,
          content: {
            dictionaryKey: "action.smile.smiles",
            params: {
              actor: PLAYER_NAME,
            },
          },
        }),
      }),
    );
  });
});
