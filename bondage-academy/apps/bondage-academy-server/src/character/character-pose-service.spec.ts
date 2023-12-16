import {
  CharacterPose,
  CharacterShape,
  CharacterSkin,
  EquippedItem,
  HeadPose,
  ItemCode,
  LowerBodyPose,
  PartialRecord,
  Player,
  Slot,
  StandardCharacterPose,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Mock, mock } from "ts-jest-mocker";
import { PlayerService } from "../player/player-service";
import { PlayerStoreService } from "../player/player-store-service";
import { configureMockServiceContainer } from "../test/mock-container";
import { CharacterPoseService } from "./character-pose-service";

const PLAYER_ID = 1;

let characterPoseService: CharacterPoseService;
let playerService: Mock<PlayerService>;
let playerStoreService: PlayerStoreService;

beforeEach(() => {
  playerService = mock(PlayerService);
  const container = configureMockServiceContainer().update(
    "playerService",
    () => playerService
  );
  characterPoseService = container.characterPoseService;
  playerStoreService = container.playerStoreService;
});

describe("changePose", () => {
  test("Return false and do not update player if new pose is invalid", async () => {
    const player = playerWithWearables({
      Shoes: equippedItem(ItemCode.CynthiaHighHeels),
    });
    const characterPose = poseWithLowerBody(LowerBodyPose.WideLegs);
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));
    jest.spyOn(playerStoreService, "update");

    const result = await characterPoseService.changePose(
      PLAYER_ID,
      characterPose
    );

    expect(result).toBe(false);
    expect(playerStoreService.update).toHaveBeenCalledTimes(0);
  });

  test("Return true and update player if new pose is valid", async () => {
    const player = playerWithWearables({
      Shoes: equippedItem(ItemCode.CynthiaHighHeels),
    });
    const characterPose = poseWithLowerBody(LowerBodyPose.WideLegsHeels);
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(player));
    jest.spyOn(playerStoreService, "update");

    const result = await characterPoseService.changePose(
      PLAYER_ID,
      characterPose
    );

    expect(result).toBe(true);
    expect(playerStoreService.update).toHaveBeenCalledTimes(1);
    expect((player.character.pose as StandardCharacterPose).lowerBody).toBe(
      LowerBodyPose.WideLegsHeels
    );
  });
});

function playerWithWearables(
  wearables: PartialRecord<Slot, EquippedItem>
): Player {
  return {
    id: PLAYER_ID,
    name: "Alice",
    character: {
      shape: CharacterShape.Shape1,
      skin: CharacterSkin.Skin1,
      wearables,
      pose: {
        upperBody: UpperBodyPose.Attention,
        lowerBody: LowerBodyPose.StandHeels,
        head: HeadPose.Normal,
      },
    },
    items: [],
  };
}

function equippedItem(itemCode: ItemCode): EquippedItem {
  return {
    item: {
      code: itemCode,
      id: 1,
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
