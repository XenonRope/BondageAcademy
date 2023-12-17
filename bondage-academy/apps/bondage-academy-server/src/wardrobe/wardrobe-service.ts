import {
  Actor,
  Character,
  CharacterPose,
  CharacterPoseValidator,
  EquippedItem,
  FullBodyPose,
  HeadPose,
  LowerBodyPose,
  Slot,
  UpperBodyPose,
  isStandardCharacterPose,
} from "@bondage-academy/bondage-academy-model";
import { CharacterPoseService } from "../character/character-pose-service";
import { PlayerClientSynchronizationService } from "../player/player-client-synchronization-service";
import { PlayerStoreService } from "../player/player-store-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";

export class WardrobeService {
  constructor(
    private playerStoreService: PlayerStoreService,
    private playerClientSynchronizationService: PlayerClientSynchronizationService,
    private wardrobeConditionChecker: WardrobeConditionChecker,
    private characterPoseValidator: CharacterPoseValidator,
    private characterPoseService: CharacterPoseService
  ) {}

  async wear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    itemId?: number;
  }): Promise<void> {
    const { actorPlayer, targetPlayer, item } =
      await this.wardrobeConditionChecker.assertCanWear(params);
    const oldItem: EquippedItem | undefined =
      targetPlayer.character.wearables[params.slot];
    const oldItemShouldGoToTarget =
      oldItem && oldItem.ownerPlayerId === targetPlayer.id;
    const newEquippedItem: EquippedItem | undefined = item
      ? { item, ownerPlayerId: actorPlayer.id }
      : undefined;

    const changePoseResult = await this.changePoseIfNeeded(
      targetPlayer.id,
      targetPlayer.character,
      params.slot,
      newEquippedItem
    );
    if (!changePoseResult) {
      console.error("Cannot change pose so item won't be equipped");
      return;
    }

    await this.playerStoreService.update(actorPlayer.id, (player) => {
      if (oldItem && !oldItemShouldGoToTarget) {
        player.items.push(oldItem.item);
      }
      if (params.itemId) {
        player.items = player.items.filter((item) => item.id !== params.itemId);
      }
    });
    await this.playerStoreService.update(targetPlayer.id, (player) => {
      if (oldItemShouldGoToTarget) {
        player.items.push(oldItem.item);
      }
      player.character.wearables[params.slot] = newEquippedItem;
    });
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      actorPlayer.id,
      {
        items: {
          add: oldItem && !oldItemShouldGoToTarget ? [oldItem.item] : [],
          remove: params.itemId ? [params.itemId] : [],
        },
      }
    );
    await this.playerClientSynchronizationService.synchronizePlayerByPlayerId(
      targetPlayer.id,
      {
        pose: targetPlayer.character.pose,
        items: {
          add: oldItemShouldGoToTarget ? [oldItem.item] : [],
        },
        wearables: [
          {
            slot: params.slot,
            equippedItem: newEquippedItem,
          },
        ],
      }
    );
  }

  private async changePoseIfNeeded(
    playerId: number,
    character: Character,
    slot: Slot,
    newEquippedItem: EquippedItem | undefined
  ): Promise<boolean> {
    const newCharacter: Character = {
      ...character,
      wearables: {
        ...character.wearables,
        [slot]: newEquippedItem,
      },
    };
    const currentPose = character.pose;
    if (this.characterPoseValidator.isPoseValid(newCharacter, currentPose)) {
      const preferablePose = this.getPreferablePoseWhatWasPreviouslyInvalid(
        character,
        newCharacter
      );
      if (preferablePose) {
        await this.characterPoseService.updatePose(playerId, preferablePose);
      }
      return true;
    }
    if (!this.characterPoseValidator.isAnyValidPose(newCharacter)) {
      return false;
    }
    const newPose = this.getNewValidPose(newCharacter);
    await this.characterPoseService.updatePose(playerId, newPose);
    return true;
  }

  private getNewValidPose(character: Character): CharacterPose {
    const currentPose = character.pose;
    const requiredPoses =
      this.characterPoseValidator.getRequiredPoses(character);
    const newHeadPose: HeadPose =
      requiredPoses.head === undefined ||
      requiredPoses.head.includes(currentPose.head)
        ? currentPose.head
        : requiredPoses.head[0];
    if (isStandardCharacterPose(currentPose)) {
      if (
        requiredPoses.upperBody?.length !== 0 &&
        requiredPoses.lowerBody?.length !== 0
      ) {
        return {
          upperBody:
            requiredPoses.upperBody === undefined ||
            requiredPoses.upperBody.includes(currentPose.upperBody)
              ? currentPose.upperBody
              : requiredPoses.upperBody[0],
          lowerBody: this.getNewValidLowerBodyPose(
            currentPose.lowerBody,
            requiredPoses.lowerBody
          ),
          head: newHeadPose,
        };
      } else {
        return {
          fullBody: requiredPoses.fullBody?.[0] ?? FullBodyPose.PetSuit,
          head: newHeadPose,
        };
      }
    } else {
      if (requiredPoses.fullBody?.length !== 0) {
        return {
          fullBody:
            requiredPoses.fullBody === undefined ||
            requiredPoses.fullBody.includes(currentPose.fullBody)
              ? currentPose.fullBody
              : requiredPoses.fullBody[0],
          head: newHeadPose,
        };
      } else {
        return {
          upperBody: requiredPoses.upperBody?.[0] ?? UpperBodyPose.Attention,
          lowerBody: requiredPoses.lowerBody?.[0] ?? LowerBodyPose.Stand,
          head: newHeadPose,
        };
      }
    }
  }

  private getNewValidLowerBodyPose(
    currentPose: LowerBodyPose,
    requiredPoses?: LowerBodyPose[]
  ): LowerBodyPose {
    if (requiredPoses === undefined || requiredPoses.includes(currentPose)) {
      return currentPose;
    }
    if (
      currentPose === LowerBodyPose.Stand &&
      requiredPoses.includes(LowerBodyPose.StandHeels)
    ) {
      return LowerBodyPose.StandHeels;
    }
    if (
      currentPose === LowerBodyPose.WideLegs &&
      requiredPoses.includes(LowerBodyPose.WideLegsHeels)
    ) {
      return LowerBodyPose.WideLegsHeels;
    }
    return requiredPoses[0];
  }

  private getPreferablePoseWhatWasPreviouslyInvalid(
    oldCharacter: Character,
    newCharacter: Character
  ): CharacterPose | undefined {
    if (isStandardCharacterPose(newCharacter.pose)) {
      if (newCharacter.pose.lowerBody === LowerBodyPose.StandHeels) {
        const preferablePose = {
          ...newCharacter.pose,
          lowerBody: LowerBodyPose.Stand,
        };
        if (
          !this.characterPoseValidator.isPoseValid(
            oldCharacter,
            preferablePose
          ) &&
          this.characterPoseValidator.isPoseValid(newCharacter, preferablePose)
        ) {
          return preferablePose;
        }
      } else if (newCharacter.pose.lowerBody === LowerBodyPose.WideLegsHeels) {
        const preferablePose = {
          ...newCharacter.pose,
          lowerBody: LowerBodyPose.WideLegs,
        };
        if (
          !this.characterPoseValidator.isPoseValid(
            oldCharacter,
            preferablePose
          ) &&
          this.characterPoseValidator.isPoseValid(newCharacter, preferablePose)
        ) {
          return preferablePose;
        }
      }
    }
  }
}
