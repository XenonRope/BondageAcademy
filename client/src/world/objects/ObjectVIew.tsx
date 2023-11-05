import type { JSX } from "solid-js/jsx-runtime";
import { isPlayerObject } from "../model/PlayerObject";
import type { WorldObject } from "../model/WorldObject";
import { PlayerView } from "./PlayerView";

export function ObjectView(props: { object: WorldObject }) {
  function renderObject(): JSX.Element {
    if (isPlayerObject(props.object)) {
      return <PlayerView object={props.object} />;
    } else {
      return <></>;
    }
  }

  return <>{renderObject()}</>;
}
