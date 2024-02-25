import { ItemCode, Player } from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Socket } from "socket.io";
import { Mock, mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerService } from "../player/player-service";
import { SessionService } from "../session/session-service";
import { ItemIdProvider } from "./item-id-provider";
import { ItemService } from "./item-service";

const PLAYER_ID = 1;

let itemService: ItemService;
let playerService: PlayerService;
let sessionService: SessionService;
let itemIdProvider: Mock<ItemIdProvider>;
let socket: Socket;

beforeEach(() => {
  container.clearInstances;

  playerService = mock(PlayerService);
  sessionService = mock(SessionService);
  itemIdProvider = mock(ItemIdProvider);
  container.registerInstance(PlayerService, playerService);
  container.registerInstance(SessionService, sessionService);
  container.registerInstance(ItemIdProvider, itemIdProvider);
  itemService = container.resolve(ItemService);
  socket = mock(Socket);
});

describe("addItemsToPlayer", () => {
  test("Add items to player inventory", async () => {
    const player = {
      id: PLAYER_ID,
      items: [{ id: 1, code: ItemCode.BallGag }],
    } as Player;
    const itemsToAdd = [{ code: ItemCode.BallGag }, { code: ItemCode.PetSuit }];
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockResolvedValue(player);
    when(itemIdProvider.getNext)
      .calledWith()
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);
    when(sessionService.getSessionByPlayerId)
      .calledWith(PLAYER_ID)
      .mockReturnValue({ socket });

    await itemService.addItemsToPlayer(PLAYER_ID, itemsToAdd);

    expect(player.items).toEqual([
      { id: 1, code: ItemCode.BallGag },
      { id: 2, code: ItemCode.BallGag },
      { id: 3, code: ItemCode.PetSuit },
    ]);
  });
});
