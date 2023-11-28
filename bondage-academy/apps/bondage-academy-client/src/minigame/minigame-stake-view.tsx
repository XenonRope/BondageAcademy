import {
  Actor,
  ItemCode,
  Minigame,
  Slot,
  isChangeWardrobeMinigameStake,
  isPlayerActor,
  itemConfigs,
  slotConfigs,
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
            props.minigame.target && (
              <div class="text-center">
                {t("minigame.changeWardrobe.youAreRemoving")}{" "}
                {getItemNameByActorAndSlot(
                  props.minigame.target,
                  props.minigame.stake.slot
                )}{" "}
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
            <div class="text-center">
              {getNameByActor(props.minigame.actor)}{" "}
              {t("minigame.changeWardrobe.isRemoving")}{" "}
              {getItemNameByActorAndSlot(
                props.minigame.target,
                props.minigame.stake.slot
              )}{" "}
              {t("minigame.changeWardrobe.fromYou")}
              {"..."}
            </div>
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

  function getItemNameByActorAndSlot(actor: Actor, slot: Slot): JSX.Element {
    const itemCode =
      storeService.getCharacterByActor(actor)?.wearables[slot]?.item.code;
    return itemCode ? getItemNameByItemCode(itemCode) : <></>;
  }

  function getItemNameByItemCode(code: ItemCode): JSX.Element {
    return <span class="font-bold">{t(itemConfigs[code].name) as string}</span>;
  }

  function getSlotName(slot: Slot): JSX.Element {
    return <span class="font-bold">{t(slotConfigs[slot].name) as string}</span>;
  }

  return <>{render()}</>;
}
