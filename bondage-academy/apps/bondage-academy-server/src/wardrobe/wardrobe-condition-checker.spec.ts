import {
  ActorType,
  CharacterShape,
  CharacterSkin,
  EquippedItem,
  HeadPose,
  Item,
  ItemCode,
  LowerBodyPose,
  PhantomItem,
  Player,
  PlayerActor,
  Slot,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { mock } from "ts-jest-mocker";
import { configureServiceContainer } from "../app/services";
import { PlayerStoreService } from "../player/player-store-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";

const PLAYER_ID = 1;
const ITEM_ID = 10;

let wardrobeConditionChecker: WardrobeConditionChecker;
let playerStoreService: PlayerStoreService;

beforeEach(() => {
  playerStoreService = mock(PlayerStoreService);
  const container = configureServiceContainer().update(
    "playerStoreService",
    () => playerStoreService
  );
  wardrobeConditionChecker = container.wardrobeConditionChecker;
});

describe("assertCanWear", () => {
  test("Shoes can be worn", async () => {
    const player = getPlayer();
    player.items.push(getItem(ITEM_ID, ItemCode.CynthiaHighHeels));
    when(playerStoreService.get)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await expect(
      wardrobeConditionChecker.assertCanWear({
        actor: getPlayerActor(),
        target: getPlayerActor(),
        slot: Slot.Shoes,
        item: { id: ITEM_ID },
      })
    ).resolves.not.toThrow();
  });

  test("Shoes cannot be worn when Pet Suit is worn", async () => {
    const player = getPlayer();
    player.character.wearables[Slot.Body] = getEquippedItem(ItemCode.PetSuit);
    player.items.push(getItem(ITEM_ID, ItemCode.CynthiaHighHeels));
    when(playerStoreService.get)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await expect(
      wardrobeConditionChecker.assertCanWear({
        actor: getPlayerActor(),
        target: getPlayerActor(),
        slot: Slot.Shoes,
        item: { id: ITEM_ID },
      })
    ).rejects.toThrow("Cannot wear CynthiaHighHeels because slot is blocked");
  });

  test("Pet Suit can be worn", async () => {
    const player = getPlayer();
    player.items.push(getItem(ITEM_ID, ItemCode.PetSuit));
    when(playerStoreService.get)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await expect(
      wardrobeConditionChecker.assertCanWear({
        actor: getPlayerActor(),
        target: getPlayerActor(),
        slot: Slot.Body,
        item: { id: ITEM_ID },
      })
    ).resolves.not.toThrow();
  });

  test("Pet Suit cannot be worn when Shoes are worn", async () => {
    const player = getPlayer();
    player.character.wearables[Slot.Shoes] = getEquippedItem(
      ItemCode.CynthiaHighHeels
    );
    player.items.push(getItem(ITEM_ID, ItemCode.PetSuit));
    when(playerStoreService.get)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await expect(
      wardrobeConditionChecker.assertCanWear({
        actor: getPlayerActor(),
        target: getPlayerActor(),
        slot: Slot.Body,
        item: { id: ITEM_ID },
      })
    ).rejects.toThrow("Cannot wear PetSuit because blocked slot is occupied");
  });

  function getPlayer(): Player {
    return {
      id: PLAYER_ID,
      name: "Alice",
      character: {
        shape: CharacterShape.Shape1,
        skin: CharacterSkin.Skin1,
        wearables: {},
        pose: {
          upperBody: UpperBodyPose.Attention,
          lowerBody: LowerBodyPose.Stand,
          head: HeadPose.Normal,
        },
      },
      items: [],
    };
  }

  function getPlayerActor(): PlayerActor {
    return {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
  }

  function getItem(id: number, code: ItemCode): Item {
    return {
      id,
      code,
    };
  }

  function getEquippedItem(code: ItemCode): EquippedItem {
    const item: PhantomItem = {
      code,
    };
    return {
      item: item,
      ownerPlayerId: PLAYER_ID,
    };
  }
});
