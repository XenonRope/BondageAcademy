import {
  GameObject,
  isBlockObject,
  isNPCObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js";
import BlockView from "./block-view";
import NPCView from "./npc-view";
import PlayerView from "./player-view";

export default function ObjectView(props: { object: GameObject }) {
  function renderObject(): JSX.Element {
    if (isPlayerObject(props.object)) {
      return <PlayerView object={props.object} />;
    }
    if (isBlockObject(props.object)) {
      return <BlockView object={props.object} />;
    }
    if (isNPCObject(props.object)) {
      return <NPCView object={props.object} />;
    }
    return <></>;
  }

  return <>{renderObject()}</>;
}
