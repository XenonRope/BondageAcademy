import {
  AnyPose,
  Character,
  poseConfigs,
} from "@bondage-academy/bondage-academy-model";
import { createMemo } from "solid-js";
import {
  characterPoseService,
  characterPoseValidator,
  storeService,
  t,
} from "../app/services";
import Button from "../ui/button";

export default function CharacterPoseButton(props: { pose: AnyPose }) {
  const character = createMemo(() => {
    return storeService.getPlayer()?.character as Character;
  });
  const newPose = createMemo(() => {
    return characterPoseService.setAnyPose(character(), props.pose);
  });
  const canChangePose = createMemo(() => {
    return characterPoseValidator.canChangeToPose(character(), newPose());
  });

  function changePose() {
    characterPoseService.changePose(newPose()).catch(console.log);
  }

  return (
    <Button onClick={changePose} disabled={!canChangePose()}>
      {t(poseConfigs[props.pose].name)}
    </Button>
  );
}
