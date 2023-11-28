import {
  Actor,
  ItemCode,
  Minigame,
  isChangeWardrobeMinigameStake,
  isPlayerActor,
  itemConfigs,
} from "@bondage-academy/bondage-academy-model";
import { JSX } from "solid-js/jsx-runtime";
import { store, storeService, t } from "../app/services";

export default function MinigameView(props: { minigame: Minigame }) {
  function render(): JSX.Element {
    if (isChangeWardrobeMinigameStake(props.minigame.stake)) {
      if (
        isPlayerActor(props.minigame.actor) &&
        props.minigame.actor.playerId === store.playerId
      ) {
        if (props.minigame.stake.item) {
          return (
            props.minigame.target && (
              <div class="text-center">
                {t("minigame.changeWardrobe.youAreUsing")}{" "}
                {getItemNameByItemCode(props.minigame.stake.item.code)}{" "}
                {t("minigame.changeWardrobe.on")}{" "}
                {getNameByActor(props.minigame.target)}
                {"..."}
              </div>
            )
          );
        } else {
          return (
            props.minigame.target &&
            props.minigame.stake.currentItem && (
              <div class="text-center">
                {t("minigame.changeWardrobe.youAreRemoving")}{" "}
                {getItemNameByItemCode(props.minigame.stake.currentItem.code)}{" "}
                {t("minigame.changeWardrobe.from")}{" "}
                {getNameByActor(props.minigame.target)}
                {"..."}
              </div>
            )
          );
        }
      }
      if (
        isPlayerActor(props.minigame.target) &&
        props.minigame.target.playerId === store.playerId
      ) {
        if (props.minigame.stake.item) {
          return (
            <div class="text-center">
              {getNameByActor(props.minigame.actor)}{" "}
              {t("minigame.changeWardrobe.isUsing")}{" "}
              {getItemNameByItemCode(props.minigame.stake.item.code)}{" "}
              {t("minigame.changeWardrobe.onYou")}
              {"..."}
            </div>
          );
        } else {
          return (
            props.minigame.stake.currentItem && (
              <div class="text-center">
                {getNameByActor(props.minigame.actor)}{" "}
                {t("minigame.changeWardrobe.isRemoving")}{" "}
                {getItemNameByItemCode(props.minigame.stake.currentItem.code)}{" "}
                {t("minigame.changeWardrobe.fromYou")}
                {"..."}
              </div>
            )
          );
        }
      }
    }
    return <></>;
  }

  function getNameByActor(actor: Actor): JSX.Element {
    const name = storeService.getNameByActor(actor);
    return name ? <span class="font-bold">{name}</span> : <></>;
  }

  function getItemNameByItemCode(code: ItemCode): JSX.Element {
    return <span class="font-bold">{t(itemConfigs[code].name) as string}</span>;
  }

  return <>{render()}</>;
}
