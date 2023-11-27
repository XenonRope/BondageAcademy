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
  function getStakeDescription(): JSX.Element {
    if (isChangeWardrobeMinigameStake(props.minigame.stake)) {
      if (
        isPlayerActor(props.minigame.actor) &&
        props.minigame.actor.playerId === store.playerId
      ) {
        if (props.minigame.stake.item) {
          return (
            <div>
              {t("minigame.stake.changeWardrobe.youAreUsing")}{" "}
              {getItemNameByItemCode(props.minigame.stake.item.code)}{" "}
              {t("minigame.stake.changeWardrobe.on")}{" "}
              {getSlotName(props.minigame.stake.slot)}
              {"..."}
            </div>
          );
        } else {
          return (
            props.minigame.target && (
              <div>
                {t("minigame.stake.changeWardrobe.youAreRemoving")}{" "}
                {getItemNameByActorAndSlot(
                  props.minigame.target,
                  props.minigame.stake.slot
                )}{" "}
                {t("minigame.stake.changeWardrobe.from")}{" "}
                {getSlotName(props.minigame.stake.slot)}
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
            <div>
              {getNameByActor(props.minigame.actor)}{" "}
              {t("minigame.stake.changeWardrobe.isUsing")}{" "}
              {getItemNameByItemCode(props.minigame.stake.item.code)}{" "}
              {t("minigame.stake.changeWardrobe.on")}{" "}
              {getSlotName(props.minigame.stake.slot)}
              {"..."}
            </div>
          );
        } else {
          return (
            <div>
              {getNameByActor(props.minigame.actor)}{" "}
              {t("minigame.stake.changeWardrobe.isRemoving")}{" "}
              {getItemNameByActorAndSlot(
                props.minigame.target,
                props.minigame.stake.slot
              )}{" "}
              {t("minigame.stake.changeWardrobe.from")}{" "}
              {getSlotName(props.minigame.stake.slot)}
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

  return (
    <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 border-[3px] border-primary-800 bg-primary-100">
      {getStakeDescription()}
    </div>
  );
}
