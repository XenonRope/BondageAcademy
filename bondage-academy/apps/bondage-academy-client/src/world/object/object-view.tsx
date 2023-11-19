import {
  GameObject,
  isBlockObject,
  isPlayerObject,
} from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js";
import BlockView from "./block-view";
import PlayerView from "./player-view";

export default function ObjectView(props: { object: GameObject }) {
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
