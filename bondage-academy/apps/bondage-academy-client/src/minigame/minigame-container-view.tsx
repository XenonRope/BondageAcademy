import { Minigame } from "@bondage-academy/bondage-academy-model";
import { JSX, Show, createEffect, createMemo, createSignal } from "solid-js";
import { storeService } from "../app/services";
import MinigameChallengeView from "./minigame-challenge-view";
import MinigameStakeView from "./minigame-stake-view";

export default function MinigameContainerView() {
  const maxMinigames = 3;

  const [displayedMinigames, setDisplayedMinigames] = createSignal<
    Array<Minigame | undefined>
  >([]);

  const anyMinigameDisplayed = createMemo<boolean>(() => {
    return displayedMinigames().find((minigame) => minigame != null) != null;
  });

  createEffect(() => {
    const minigames = storeService.getPlayerMinigames();
    setDisplayedMinigames((displayedMinigames) => {
      let newMinigames = minigames.filter(
        (minigame) =>
          !displayedMinigames.find(
            (displayedMinigame) => displayedMinigame?.id === minigame.id
          )
      );
      for (let i = 0; i < maxMinigames; i++) {
        const displayedMinigame = displayedMinigames[i];
        if (
          displayedMinigame &&
          !minigames.find((minigame) => minigame.id === displayedMinigame.id)
        ) {
          displayedMinigames[i] = undefined;
        }
      }

      for (let i = 0; i < maxMinigames; i++) {
        if (!displayedMinigames[i] && newMinigames.length > 0) {
          displayedMinigames[i] = newMinigames[0];
          newMinigames = newMinigames.slice(1);
        }
      }

      return [...displayedMinigames];
    });
  });

  function renderMinigame(minigame?: Minigame): JSX.Element {
    if (!minigame) {
      return <div></div>;
    }
    return (
      <div class="flex items-center h-full">
        <div class="flex flex-col items-center w-full">
          <div class="p-4 border-[3px] border-primary-800 bg-primary-100">
            <div class="mb-4">
              <MinigameStakeView minigame={minigame} />
            </div>
            <div>
              <MinigameChallengeView minigame={minigame} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Show when={anyMinigameDisplayed()}>
      <div class="fixed top-0 left-0 w-full h-full">
        <div class="grid h-full w-full grid-cols-3">
          {renderMinigame(displayedMinigames()[1])}
          {renderMinigame(displayedMinigames()[0])}
          {renderMinigame(displayedMinigames()[2])}
        </div>
      </div>
    </Show>
  );
}
