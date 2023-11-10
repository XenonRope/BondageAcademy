import { For } from "solid-js";
import type { Character } from "./model/Character";
import { FullBodyPose } from "./model/CharacterPose";

interface CharacterLayer {
  url: string;
  yOffset?: number;
}

export default function CharacterView(props: { character: Character }) {
  function getLayers(): CharacterLayer[] {
    const characterPrefix = "Kiri - ";
    const layers: CharacterLayer[] = [];
    if ("fullBody" in props.character.pose) {
      layers.push({
        url: `public/character/${characterPrefix} - ${getNameOfFullBodyPose(
          props.character.pose.fullBody,
        )} - Body.png`,
        yOffset: getYOffsetOfFullBodyPose(props.character.pose.fullBody),
      });
    }

    return layers;
  }

  function getNameOfFullBodyPose(pose: FullBodyPose): string {
    switch (pose) {
      case FullBodyPose.PetSuit:
        return "Pet suit";
    }
  }

  function getYOffsetOfFullBodyPose(pose: FullBodyPose): number {
    switch (pose) {
      case FullBodyPose.PetSuit:
        return 0;
    }
  }

  return (
    <div class="relative h-[800px] w-[600px] bg-gray-100">
      <For each={getLayers()}>
        {(layer) => (
          <div
            class="absolute h-full w-full"
            style={{
              "background-image": `url("${layer.url}")`,
            }}
          />
        )}
      </For>
    </div>
  );
}
