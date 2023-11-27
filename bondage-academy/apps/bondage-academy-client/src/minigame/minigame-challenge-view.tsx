import {
  Minigame,
  isClickMinigameChallange,
  isPlayerActor,
} from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js/jsx-runtime";
import { minigameService, store, t } from "../app/services";
import Button from "../ui/button";

export default function MinigameChallengeView(props: { minigame: Minigame }) {
  function render(): JSX.Element {
    if (isClickMinigameChallange(props.minigame.challange)) {
      if (
        isPlayerActor(props.minigame.actor) &&
        props.minigame.actor.playerId === store.playerId
      ) {
        return (
          <div class="flex flex-col items-center">
            <Button onClick={cancel}>{t("minigame.common.cancel")}</Button>
          </div>
        );
      }
      if (
        isPlayerActor(props.minigame.target) &&
        props.minigame.target.playerId === store.playerId
      ) {
        return (
          <div class="flex flex-col items-center">
            <Button onClick={resist}>
              {t("minigame.changeWardrobe.resist")}
            </Button>
          </div>
        );
      }
    }
    return <> </>;
  }

  function cancel() {
    minigameService.changeProgess(props.minigame.id, -1).catch(console.log);
  }

  function resist() {
    minigameService.changeProgess(props.minigame.id, 1).catch(console.log);
  }

  return <>{render()}</>;
}
