import type { JSX } from "solid-js/jsx-runtime";
import { isBlockObject } from "../model/BlockObject";
import { isPlayerObject } from "../model/PlayerObject";
import type { WorldObject } from "../model/WorldObject";
import BlockView from "./BlockView";
import PlayerView from "./PlayerView";

export default function ObjectView(props: { object: WorldObject }) {
  function renderObject(): JSX.Element {
    if (isPlayerObject(props.object)) {
      return <PlayerView object={props.object} />;
    }
    if (isBlockObject(props.object)) {
      return <BlockView object={props.object} />;
    }
    return <></>;
  }

  return <>{renderObject()}</>;
}
