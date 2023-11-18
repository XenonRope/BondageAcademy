import { characterPoseService } from "../app/services";
import Button from "../ui/Button";
import type { Character } from "./model/Character";
import {
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "./model/CharacterPose";

export default function CharacterPoseController(props: {
  character: Character;
}) {
  function changeUpperBodyPose(pose: UpperBodyPose) {
    characterPoseService
      .changeUpperBodyPose(props.character, pose)
      .catch(console.log);
  }

  function changeLowerBodyPose(pose: LowerBodyPose) {
    characterPoseService
      .changeLowerBodyPose(props.character, pose)
      .catch(console.log);
  }

  function changeFullBodyPose(pose: FullBodyPose) {
    characterPoseService
      .changeFullBodyPose(props.character, pose)
      .catch(console.log);
  }

  function changeHeadPose(pose: HeadPose) {
    characterPoseService
      .changeHeadPose(props.character, pose)
      .catch(console.log);
  }

  return (
    <div>
      <div class="mb-2">
        <span class="mr-2">
          <Button onClick={() => changeUpperBodyPose(UpperBodyPose.Attention)}>
            Attention
          </Button>
        </span>
        <Button onClick={() => changeUpperBodyPose(UpperBodyPose.Crossed)}>
          Crossed
        </Button>
      </div>
      <div class="mb-2">
        <span class="mr-2">
          <Button onClick={() => changeLowerBodyPose(LowerBodyPose.Stand)}>
            Stand
          </Button>
        </span>
        <span class="mr-2">
          <Button
            onClick={() => changeLowerBodyPose(LowerBodyPose.SimpleKneel)}
          >
            Simple kneel
          </Button>
        </span>
        <Button onClick={() => changeLowerBodyPose(LowerBodyPose.WideKneel)}>
          Wide kneel
        </Button>
      </div>
      <div class="mb-2">
        <Button onClick={() => changeFullBodyPose(FullBodyPose.PetSuit)}>
          Pet suit
        </Button>
      </div>
      <div>
        <span class="mr-2">
          <Button onClick={() => changeHeadPose(HeadPose.Normal)}>
            Normal
          </Button>
        </span>
        <Button onClick={() => changeHeadPose(HeadPose.WideOpen)}>
          Wide open
        </Button>
      </div>
    </div>
  );
}
