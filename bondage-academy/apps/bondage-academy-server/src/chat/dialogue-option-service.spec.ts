import {
  DictionaryKey,
  EventFromServer,
  GameObject,
  NPCCode,
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
import { DialogueOptionService } from "./dialogue-option-service";

const PLAYER_ID = 1;
const PLAYER_NAME = "Alice";
const ROOM_ID = 10;

let dialogueOptionService: DialogueOptionService;
let playerService: PlayerService;
let roomService: RoomService;
let sessionService: SessionService;
let socket: Socket;

beforeEach(() => {
  container.clearInstances();

  playerService = mock(PlayerService);
  roomService = mock(RoomService);
  sessionService = mock(SessionService);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(RoomService, roomService);
  container.registerInstance(SessionService, sessionService);
  dialogueOptionService = container.resolve(DialogueOptionService);
  socket = mock(Socket);
});

describe("useDialogueOption", () => {
  test("Throw error if player is not in a room", async () => {
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({ roomId: undefined } as Player);

    await expect(
      dialogueOptionService.useDialogueOption(
        PLAYER_ID,
        NPCCode.Headmistress,
        "dialogue.whoAreYou",
      ),
    ).rejects.toThrow("Cannot use dialogue option while not in a room");
  });

  test("Throw error if dialogue option not found", async () => {
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({ roomId: ROOM_ID } as Player);

    await expect(
      dialogueOptionService.useDialogueOption(
        PLAYER_ID,
        NPCCode.Headmistress,
        "dialogue.whereAmI" as DictionaryKey,
      ),
    ).rejects.toThrow(
      "Dialogue option with npcCode Headmistress and content dialogue.whereAmI not found",
    );
  });

  test("Throw error if NPC is not in the room", async () => {
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({ roomId: ROOM_ID } as Player);
    when(roomService.getRoomById)
      .calledWith(ROOM_ID)
      .mockResolvedValue({ objects: [] as GameObject[] } as Room);

    await expect(
      dialogueOptionService.useDialogueOption(
        PLAYER_ID,
        NPCCode.Headmistress,
        "dialogue.whoAreYou",
      ),
    ).rejects.toThrow(
      "Cannot use dialogue option with content dialogue.whoAreYou becuse NPC Headmistress is not in the room",
    );
  });

  test("Send chat message to players in the room", async () => {
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue({ roomId: ROOM_ID, name: PLAYER_NAME } as Player);
    when(roomService.getRoomById)
      .calledWith(ROOM_ID)
      .mockResolvedValue({
        objects: [
          { type: ObjectType.NPC, code: NPCCode.Headmistress },
          { type: ObjectType.Player, playerId: PLAYER_ID } as PlayerObject,
        ] as GameObject[],
      } as Room);
    when(sessionService.getSessionByPlayerId)
      .calledWith(PLAYER_ID)
      .mockReturnValue({ socket });

    await dialogueOptionService.useDialogueOption(
      PLAYER_ID,
      NPCCode.Headmistress,
      "dialogue.whoAreYou",
    );

    expect(socket.emit).toHaveBeenCalledWith(
      EventFromServer.ChatMessage,
      expect.objectContaining({
        message: expect.objectContaining({
          speaker: PLAYER_NAME,
          content: { dictionaryKey: "dialogue.whoAreYou" },
        }),
      }),
    );
  });
});
