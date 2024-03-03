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
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { PlayerService } from "../player/player-service";
import { WardrobeService } from "./wardrobe-service";
import { setupContainer } from "../test/setup-container";

const PLAYER_ID = 1;
const ITEM_ID = 10;

let wardrobeService: WardrobeService;
let playerService: PlayerService;

beforeEach(() => {
  setupContainer();

  playerService = mock(PlayerService);
  container.registerInstance(PlayerService, playerService);
  wardrobeService = container.resolve(WardrobeService);
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
      item: { id: ITEM_ID },
    });

    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      poseWithLowerBody(LowerBodyPose.StandHeels),
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
      item: { id: ITEM_ID },
    });

    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      poseWithLowerBody(LowerBodyPose.WideLegsHeels),
    );
  });

  test("Change pose from 'StandHeels' to 'Stand' after removing heels", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.StandHeels));
    player.character.wearables[Slot.Shoes] = equippedItem(
      ItemCode.CynthiaHighHeels,
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
      item: undefined,
    });

    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      poseWithLowerBody(LowerBodyPose.Stand),
    );
  });

  test("Do not change pose from 'StandHeels' to 'Stand' after removing sleeves", async () => {
    const player = playerWithPose(poseWithLowerBody(LowerBodyPose.StandHeels));
    player.character.wearables[Slot.LeftSleeve] = equippedItem(
      ItemCode.XFashionSleeve,
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
      item: undefined,
    });

    expect(playerService.updatePose).toHaveBeenCalledTimes(0);
  });

  test("Change pose from 'WideLegsHeels' to 'WideLegs' after removing heels", async () => {
    const player = playerWithPose(
      poseWithLowerBody(LowerBodyPose.WideLegsHeels),
    );
    player.character.wearables[Slot.Shoes] = equippedItem(
      ItemCode.CynthiaHighHeels,
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
      item: undefined,
    });

    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      poseWithLowerBody(LowerBodyPose.WideLegs),
    );
  });

  test("Change pose from 'WideOpen' to 'Default' after removing ball gag", async () => {
    const player = playerWithPose(poseWithHead(HeadPose.WideOpen));
    player.character.wearables[Slot.Mouth] = equippedItem(ItemCode.BallGag);
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
      slot: Slot.Mouth,
      item: undefined,
    });

    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      poseWithHead(HeadPose.Normal),
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

function poseWithHead(pose: HeadPose): CharacterPose {
  return {
    upperBody: UpperBodyPose.Attention,
    lowerBody: LowerBodyPose.Stand,
    head: pose,
  };
}
