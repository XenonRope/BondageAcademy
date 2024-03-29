import {
  ActorType,
  Character,
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
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { when } from "jest-when";
import { Mock, mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { ActorData } from "../actor/actor-data";
import { PlayerService } from "../player/player-service";
import { PlayerStoreService } from "../player/player-store-service";
import { CharacterPoseService } from "./character-pose-service";
import { setupContainer } from "../test/setup-container";

const PLAYER_ID = 1;

let characterPoseService: CharacterPoseService;
let playerService: Mock<PlayerService>;
let playerStoreService: PlayerStoreService;

beforeEach(() => {
  setupContainer();

  playerService = mock(PlayerService);
  container.registerInstance(PlayerService, playerService);
  characterPoseService = container.resolve(CharacterPoseService);
  playerStoreService = container.resolve(PlayerStoreService);
});

describe("changePose", () => {
  test("Return false and do not update player if new pose is invalid", async () => {
    const actor: ActorData = actorDataWithWearables({
      Shoes: equippedItem(ItemCode.CynthiaHighHeels),
    });
    const characterPose = poseWithLowerBody(LowerBodyPose.WideLegs);
    jest.spyOn(playerStoreService, "updatePose");

    const result = await characterPoseService.changePose(actor, characterPose);

    expect(result).toBe(false);
    expect(playerService.updatePose).toHaveBeenCalledTimes(0);
  });

  test("Return true and update player if new pose is valid", async () => {
    const wearables = {
      Shoes: equippedItem(ItemCode.CynthiaHighHeels),
    };
    const actor: ActorData = actorDataWithWearables(wearables);
    const characterPose = poseWithLowerBody(LowerBodyPose.WideLegsHeels);
    when(playerService.getPlayer)
      .calledWith(PLAYER_ID)
      .mockReturnValue(Promise.resolve(playerWithWearables(wearables)));
    jest.spyOn(playerStoreService, "updatePose");

    const result = await characterPoseService.changePose(actor, characterPose);

    expect(result).toBe(true);
    expect(playerService.updatePose).toHaveBeenCalledWith(
      PLAYER_ID,
      characterPose,
    );
  });
});

function actorDataWithWearables(
  wearables: PartialRecord<Slot, EquippedItem>,
): ActorData {
  return {
    actor: {
      type: ActorType.Player,
      playerId: PLAYER_ID,
    },
    character: characterWithWearables(wearables),
    playerId: PLAYER_ID,
  };
}

function playerWithWearables(
  wearables: PartialRecord<Slot, EquippedItem>,
): Player {
  return {
    id: PLAYER_ID,
    name: "Alice",
    character: characterWithWearables(wearables),
    items: [],
  };
}

function characterWithWearables(
  wearables: PartialRecord<Slot, EquippedItem>,
): Character {
  return {
    shape: CharacterShape.Shape1,
    skin: CharacterSkin.Skin1,
    wearables,
    pose: {
      upperBody: UpperBodyPose.Attention,
      lowerBody: LowerBodyPose.StandHeels,
      head: HeadPose.Normal,
    },
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
