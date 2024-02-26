import {
  GameObject,
  ObjectType,
  Player,
  PlayerObject,
  Room,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerService } from "../player/player-service";
import { RoomService } from "../room/room-service";
import { MotionStorage } from "./motion-storage";
import { MovementService } from "./movement-service";

const PLAYER_ID = 1;
const ROOM_ID = 10;
const PLAYER_OBJECT_ID = 100;

let movementService: MovementService;
let motionStorage: MotionStorage;
let playerService: PlayerService;
let roomService: RoomService;

beforeEach(() => {
  container.clearInstances();

  playerService = mock(PlayerService);
  roomService = mock(RoomService);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(RoomService, roomService);
  movementService = container.resolve(MovementService);
  motionStorage = container.resolve(MotionStorage);
});

describe("setPlayerTargetPosition", () => {
  test("Throw error if player is not in a room", async () => {
    const player = { id: PLAYER_ID, roomId: undefined } as Player;
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue(player);

    await expect(
      movementService.setPlayerTargetPosition(PLAYER_ID, { x: 2, y: 3 }),
    ).rejects.toThrow("Player 1 is not in a room");
  });

  test("Throw error if player does not have player object in room", async () => {
    const player = { id: PLAYER_ID, roomId: ROOM_ID } as Player;
    const room = { id: ROOM_ID, objects: [] as GameObject[] } as Room;
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue(player);
    when(roomService.getRoomById).calledWith(ROOM_ID).mockResolvedValue(room);

    await expect(
      movementService.setPlayerTargetPosition(PLAYER_ID, { x: 2, y: 3 }),
    ).rejects.toThrow("Player 1 does not have player object in room 10");
  });

  test("Set player target position", async () => {
    const player = { id: PLAYER_ID, roomId: ROOM_ID } as Player;
    const playerObject = {
      type: ObjectType.Player,
      id: PLAYER_OBJECT_ID,
      playerId: PLAYER_ID,
      position: { x: 1, y: 1 },
    } as PlayerObject;
    const room = {
      id: ROOM_ID,
      objects: [playerObject] as GameObject[],
    } as Room;
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue(player);
    when(roomService.getRoomById).calledWith(ROOM_ID).mockResolvedValue(room);

    await movementService.setPlayerTargetPosition(PLAYER_ID, { x: 2, y: 3 });

    const motion = motionStorage.getOrCreateMotionByObjectId(PLAYER_OBJECT_ID);
    expect(motion.targetPosition).toEqual({ x: 2, y: 3 });
  });

  test("Throw error if target position out of room bounds", async () => {
    const player = { id: PLAYER_ID, roomId: ROOM_ID } as Player;
    const playerObject = {
      type: ObjectType.Player,
      id: PLAYER_OBJECT_ID,
      playerId: PLAYER_ID,
    } as PlayerObject;
    const room = {
      id: ROOM_ID,
      objects: [playerObject] as GameObject[],
      width: 10,
      height: 10,
    } as Room;
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue(player);
    when(roomService.getRoomById).calledWith(ROOM_ID).mockResolvedValue(room);

    await expect(
      movementService.setPlayerTargetPosition(PLAYER_ID, { x: 11, y: 10 }),
    ).rejects.toThrow("Position is out of bounds");
  });
});
