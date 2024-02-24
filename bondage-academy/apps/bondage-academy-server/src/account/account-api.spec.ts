import { Player, RoomState } from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Socket } from "socket.io";
import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerStoreService } from "../player/player-store-service";
import { RoomUtilsService } from "../room/room-utils-service";
import { Session } from "../session/model/session";
import { AccountApi } from "./account-api";
import { AccountService } from "./account-service";

const PLAYER_ID = 1;
const ACCOUNT_ID = 10;
const ROOM_ID = 100;
const USERNAME = "Alice";
const PASSWORD = "password123!";

let accountApi: AccountApi;
let accountService: AccountService;
let playerStoreService: PlayerStoreService;
let roomUtilsService: RoomUtilsService;
let socket: Socket;

beforeEach(() => {
  container.clearInstances();

  accountService = mock(AccountService);
  playerStoreService = mock(PlayerStoreService);
  roomUtilsService = mock(RoomUtilsService);
  container.registerInstance(AccountService, accountService);
  container.registerInstance(PlayerStoreService, playerStoreService);
  container.registerInstance(RoomUtilsService, roomUtilsService);
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
    when(playerStoreService.get)
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
    when(playerStoreService.get)
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
    when(playerStoreService.get)
      .calledWith(PLAYER_ID)
      .mockReturnValue(
        Promise.resolve({ id: PLAYER_ID, roomId: ROOM_ID } as Player),
      );
    when(roomUtilsService.getRoomState)
      .calledWith(ROOM_ID)
      .mockResolvedValue({ room: { id: ROOM_ID } } as RoomState);

    const response = await accountApi.login(
      { username: USERNAME, password: PASSWORD },
      session,
    );

    expect(response.room?.id).toEqual(ROOM_ID);
  });
});
