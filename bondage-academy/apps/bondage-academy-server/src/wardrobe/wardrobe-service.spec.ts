import {
  ActorType,
  CharacterPose,
  CharacterShape,
  CharacterSkin,
  EquippedItem,
  HeadPose,
  ItemCode,
  LowerBodyPose,
  Player,
  PlayerActor,
  Slot,
  StandardCharacterPose,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { mock } from "ts-jest-mocker";
import { PlayerService } from "../player/player-service";
import { configureMockServiceContainer } from "../test/mock-container";
import { WardrobeService } from "./wardrobe-service";

const PLAYER_ID = 1;
const ITEM_ID = 10;

let wardrobeService: WardrobeService;
let playerService: PlayerService;

beforeEach(() => {
  playerService = mock(PlayerService);
  const container = configureMockServiceContainer().update(
    "playerService",
    () => playerService
  );
  wardrobeService = container.wardrobeService;
});

describe("wear", () => {
  test("Change pose from 'Stand' to 'StandHeels' after wearing heels", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.Stand));
    player.items.push({ id: ITEM_ID, code: ItemCode.CynthiaHighHeels });
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await wardrobeService.wear({
      actor,
      target: actor,
      slot: Slot.Shoes,
      itemId: ITEM_ID,
    });

    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.StandHeels
    );
  });

  test("Change pose from 'WideLegs' to 'WideLegsHeels' after wearing heels", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.WideLegs));
    player.items.push({ id: ITEM_ID, code: ItemCode.CynthiaHighHeels });
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await wardrobeService.wear({
      actor,
      target: actor,
      slot: Slot.Shoes,
      itemId: ITEM_ID,
    });

    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.WideLegsHeels
    );
  });

  test("Change pose from 'StandHeels' to 'Stand' after removing heels", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.StandHeels));
    player.character.wearables[Slot.Shoes] = equippedItem(
      ItemCode.CynthiaHighHeels
    );
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await wardrobeService.wear({
      actor,
      target: actor,
      slot: Slot.Shoes,
      itemId: undefined,
    });

    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.Stand
    );
  });

  test("Do not change pose from 'StandHeels' to 'Stand' after removing sleeves", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.StandHeels));
    player.character.wearables[Slot.LeftSleeve] = equippedItem(
      ItemCode.XFashionSleeve
    );
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await wardrobeService.wear({
      actor,
      target: actor,
      slot: Slot.LeftSleeve,
      itemId: undefined,
    });

    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.StandHeels
    );
  });

  test("Change pose from 'WideLegsHeels' to 'WideLegs' after removing heels", async () => {
    const player = playerWithPose(
      poseWithLowerBody(LowerBodyPose.WideLegsHeels)
    );
    player.character.wearables[Slot.Shoes] = equippedItem(
      ItemCode.CynthiaHighHeels
    );
    const actor: PlayerActor = {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    };
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));

    await wardrobeService.wear({
      actor,
      target: actor,
      slot: Slot.Shoes,
      itemId: undefined,
    });

    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.WideLegs
    );
  });
});

function playerWithPose(pose: CharacterPose): Player {
  return {
    id: PLAYER_ID,
    name: "Alice",
    character: {
      shape: CharacterShape.Shape1,
      skin: CharacterSkin.Skin1,
      wearables: {},
      pose,
    },
    items: [],
  };
}

function equippedItem(itemCode: ItemCode): EquippedItem {
  return {
    item: {
      id: ITEM_ID,
      code: itemCode,
    },
    ownerPlayerId: PLAYER_ID,
  };
}

function poseWithLowerBody(pose: LowerBodyPose): CharacterPose {
  return {
    upperBody: UpperBodyPose.Attention,
    lowerBody: pose,
    head: HeadPose.Normal,
  };
}
