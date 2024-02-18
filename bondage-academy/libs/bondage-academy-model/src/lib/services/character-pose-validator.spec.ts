import {
  Character,
  CharacterShape,
  CharacterSkin,
  EquippedItem,
} from "../model/character";
import {
  CharacterPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "../model/character-pose";
import { ItemCode } from "../model/item";
import { Slot } from "../model/slot";
import { CharacterPoseValidator } from "./character-pose-validator";

let characterPoseValidator: CharacterPoseValidator;

beforeEach(() => {
  characterPoseValidator = new CharacterPoseValidator();
});

describe("isPoseValid", () => {
  let character: Character;

  beforeEach(() => {
    character = {
      shape: CharacterShape.Shape1,
      skin: CharacterSkin.Skin1,
      wearables: {},
      pose: {
        upperBody: UpperBodyPose.Attention,
        lowerBody: LowerBodyPose.Stand,
        head: HeadPose.Normal,
      },
    };
  });

  test('"Stand" pose is invalid while wearing high heels', () => {
    character.wearables[Slot.Shoes] = equippedItem(ItemCode.CynthiaHighHeels);
    character.pose = poseWithLowerBody(LowerBodyPose.Stand);

    expect(characterPoseValidator.isPoseValid(character, character.pose)).toBe(
      false,
    );
  });

  test('"Stand heels" pose is valid while wearing high heels', () => {
    character.wearables[Slot.Shoes] = equippedItem(ItemCode.CynthiaHighHeels);
    character.pose = poseWithLowerBody(LowerBodyPose.StandHeels);

    expect(characterPoseValidator.isPoseValid(character, character.pose)).toBe(
      true,
    );
  });
});

function equippedItem(itemCode: ItemCode): EquippedItem {
  return {
    item: {
      code: itemCode,
      id: 1,
    },
    ownerPlayerId: 1,
  };
}

function poseWithLowerBody(pose: LowerBodyPose): CharacterPose {
  return {
    upperBody: UpperBodyPose.Attention,
    lowerBody: pose,
    head: HeadPose.Normal,
  };
}
