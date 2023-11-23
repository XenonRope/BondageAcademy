import {
  Character,
  CharacterShape,
  CharacterSkin,
  HeadPose,
  LowerBodyPose,
  NPCCode,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";

export class NPCCharacterService {
  getCharacterByNPCCode(code: NPCCode): Character {
    switch (code) {
      case NPCCode.Headmistress:
        return {
          shape: CharacterShape.Shape1,
          skin: CharacterSkin.Skin1,
          wearables: {},
          pose: {
            upperBody: UpperBodyPose.Crossed,
            lowerBody: LowerBodyPose.Stand,
            head: HeadPose.Normal,
          },
        };
    }
  }
}
