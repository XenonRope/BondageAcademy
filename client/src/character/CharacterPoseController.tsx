import type { Character } from "./model/Character";
import {
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  UpperBodyPose,
} from "./model/CharacterPose";
import { characterPoseService } from "./service/CharacterPoseService";

export default function CharacterPoseController(props: {
  character: Character;
}) {
  return (
    <div>
      <div>
        <button
          onClick={async () => {
            await characterPoseService.changeUpperBodyPose(
              props.character,
              UpperBodyPose.Attention,
            );
          }}
        >
          Attention
        </button>
        <button
          onClick={async () => {
            await characterPoseService.changeUpperBodyPose(
              props.character,
              UpperBodyPose.Crossed,
            );
          }}
        >
          Crossed
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            await characterPoseService.changeLowerBodyPose(
              props.character,
              LowerBodyPose.Stand,
            );
          }}
        >
          Stand
        </button>
        <button
          onClick={async () => {
            await characterPoseService.changeLowerBodyPose(
              props.character,
              LowerBodyPose.SimpleKneel,
            );
          }}
        >
          Simple kneel
        </button>
        <button
          onClick={async () => {
            await characterPoseService.changeLowerBodyPose(
              props.character,
              LowerBodyPose.WideKneel,
            );
          }}
        >
          Wide kneel
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            await characterPoseService.changeFullBodyPose(
              props.character,
              FullBodyPose.PetSuit,
            );
          }}
        >
          Pet suit
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            await characterPoseService.changeHeadPose(
              props.character,
              HeadPose.Normal,
            );
          }}
        >
          Normal
        </button>
        <button
          onClick={async () => {
            await characterPoseService.changeHeadPose(
              props.character,
              HeadPose.WideOpen,
            );
          }}
        >
          Wide open
        </button>
      </div>
    </div>
  );
}
