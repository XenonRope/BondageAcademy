import { Minigame } from "@bondage-academy/bondage-academy-model";

export default function MinigameView(props: { minigame: Minigame }) {
  return (
    <div class="absolute w-[200px] h-[60px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-[3px] border-primary-800 bg-primary-100"></div>
  );
}
