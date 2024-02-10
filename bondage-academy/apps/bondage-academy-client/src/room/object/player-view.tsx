import {
  ActorType,
  PlayerObject,
  isPlayerActor,
  prepareActorByPlayerId,
} from "@bondage-academy/bondage-academy-model";
import { JSX, Show, createMemo } from "solid-js";
import { store, storeService } from "../../app/services";
import CharacterView from "../../character/character-view";
import { ROOM_CHARACTER_WDITH, ROOM_TILE_SIZE } from "../model/room";

export default function PlayerView(props: { object: PlayerObject }) {
  const getCharacter = createMemo(() =>
    storeService.getCharacterByActor(
      prepareActorByPlayerId(props.object.playerId)
    )
  );

  const selected = createMemo(
    () =>
      isPlayerActor(store.selectedActor) &&
      store.selectedActor.playerId === props.object.playerId
  );

  function selectPlayer(event: MouseEvent) {
    event.stopPropagation();
    if (selected()) {
      storeService.selectActor(undefined);
    } else {
      storeService.selectActor({
        type: ActorType.Player,
        playerId: props.object.playerId,
      });
    }
  }

  function render(): JSX.Element {
    const position = storeService.getPositionByObjectId(props.object.id);
    if (!position) {
      return <></>;
    }

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        onMouseDown={selectPlayer}
        class="absolute"
        style={{
          width: `${ROOM_TILE_SIZE}px`,
          height: `${ROOM_TILE_SIZE}px`,
          transform: `translate(${position.x * ROOM_TILE_SIZE}px, ${
            position.y * ROOM_TILE_SIZE
          }px)`,
        }}
      >
        <Show when={getCharacter()}>
          {(character) => (
            <div
              class="absolute left-[50%] translate-x-[-50%] bottom-0"
              style={{ width: `${ROOM_CHARACTER_WDITH}px` }}
            >
              <CharacterView character={character()}></CharacterView>
            </div>
          )}
        </Show>
      </div>
    );
  }

  return <>{render()}</>;
}
