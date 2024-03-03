import {
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
import { Session } from "../session/model/session";
import { setupContainer } from "../test/setup-container";
import { AccountApi } from "./account-api";
import { AccountService } from "./account-service";

const PLAYER_ID = 1;
const ACCOUNT_ID = 10;
const ROOM_ID = 100;
const USERNAME = "Alice";
const PASSWORD = "password123!";

let accountApi: AccountApi;
let accountService: AccountService;
let playerService: PlayerService;
let roomService: RoomService;
let socket: Socket;

beforeEach(() => {
  setupContainer();

  accountService = mock(AccountService);
  playerService = mock(PlayerService);
  roomService = mock(RoomService);
  container.registerInstance(AccountService, accountService);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(RoomService, roomService);
  accountApi = container.resolve(AccountApi);
  socket = mock(Socket);
});

describe("login", () => {
  test("Return player id", async () => {
    const session: Session = { socket };
    when(accountService.getAccountByUsernameAndPassword)
      .calledWith(USERNAME, PASSWORD)
      .mockReturnValue(
        Promise.resolve({
          id: ACCOUNT_ID,
          playerId: PLAYER_ID,
          username: USERNAME,
          password: PASSWORD,
        }),
      );
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve({ id: PLAYER_ID } as Player));

    const response = await accountApi.login(
      { username: USERNAME, password: PASSWORD },
      session,
    );

    expect(response.playerId).toEqual(PLAYER_ID);
  });

  test("Do not return room data if player is not in a room", async () => {
    const session: Session = { socket };
    when(accountService.getAccountByUsernameAndPassword)
      .calledWith(USERNAME, PASSWORD)
      .mockReturnValue(
        Promise.resolve({
          id: ACCOUNT_ID,
          playerId: PLAYER_ID,
          username: USERNAME,
          password: PASSWORD,
        }),
      );
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve({ id: PLAYER_ID } as Player));

    const response = await accountApi.login(
      { username: USERNAME, password: PASSWORD },
      session,
    );

    expect(response.room).toBeUndefined();
  });

  test("Return room data if player is in a room", async () => {
    const session: Session = { socket };
    when(accountService.getAccountByUsernameAndPassword)
      .calledWith(USERNAME, PASSWORD)
      .mockReturnValue(
        Promise.resolve({
          id: ACCOUNT_ID,
          playerId: PLAYER_ID,
          username: USERNAME,
          password: PASSWORD,
        }),
      );
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(
        Promise.resolve({ id: PLAYER_ID, roomId: ROOM_ID } as Player),
      );
    when(roomService.getRoomById)
      .calledWith(ROOM_ID)
      .mockResolvedValue({
        id: ROOM_ID,
        objects: [
          { type: ObjectType.Player, playerId: PLAYER_ID } as PlayerObject,
        ] as GameObject[],
      } as Room);

    const response = await accountApi.login(
      { username: USERNAME, password: PASSWORD },
      session,
    );

    expect(response.room?.id).toEqual(ROOM_ID);
  });
});
