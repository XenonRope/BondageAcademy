import { Minigame } from "@bondage-academy/bondage-academy-model";
import MinigameChallengeView from "./minigame-challenge-view";
import MinigameStakeView from "./minigame-stake-view";

export default function MinigameView(props: { minigame: Minigame }) {
  return (
    <div class="flex items-center h-full">
      <div class="flex flex-col items-center w-full">
        <div class="p-4 border-[3px] border-primary-800 bg-primary-100">
          <div class="mb-4">
            <MinigameStakeView minigame={props.minigame} />
          </div>
          <div>
            <MinigameChallengeView minigame={props.minigame} />
          </div>
        </div>
      </div>
    </div>
  );
}
