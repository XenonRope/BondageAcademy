import {
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import CharacterPoseButton from "./character-pose-button";

export default function CharacterPoseController() {
  return (
    <div>
      <div class="mb-2">
        <div class="text-sm font-bold mb-1">Upper body</div>
        <span class="mr-2">
          <CharacterPoseButton
            pose={UpperBodyPose.Attention}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={UpperBodyPose.Crossed}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={UpperBodyPose.HandsUp}
          ></CharacterPoseButton>
        </span>
      </div>
      <div class="mb-2">
        <div class="text-sm font-bold mb-1">Lower body</div>
        <span class="mr-2">
          <CharacterPoseButton pose={LowerBodyPose.Stand}></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={LowerBodyPose.StandHeels}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={LowerBodyPose.WideLegs}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={LowerBodyPose.WideLegsHeels}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={LowerBodyPose.SimpleKneel}
          ></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton
            pose={LowerBodyPose.WideKneel}
          ></CharacterPoseButton>
        </span>
      </div>
      <div class="mb-2">
        <div class="text-sm font-bold mb-1">Full body</div>
        <span class="mr-2">
          <CharacterPoseButton
            pose={FullBodyPose.PetSuit}
          ></CharacterPoseButton>
        </span>
      </div>
      <div>
        <div class="text-sm font-bold mb-1">Head</div>
        <span class="mr-2">
          <CharacterPoseButton pose={HeadPose.Normal}></CharacterPoseButton>
        </span>
        <span class="mr-2">
          <CharacterPoseButton pose={HeadPose.WideOpen}></CharacterPoseButton>
        </span>
      </div>
    </div>
  );
}
