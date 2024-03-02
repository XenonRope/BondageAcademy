import {
  Actor,
  Character,
  CharacterPose,
  CharacterPoseValidator,
  EquippedItem,
  FullBodyPose,
  HeadPose,
  ItemReference,
  LowerBodyPose,
  PhantomItem,
  Slot,
  UpperBodyPose,
  areCharacterPosesEqual,
  isItem,
  isPhantomItem,
  isPlayerActor,
  isStandardCharacterPose,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ActorData } from "../actor/actor-data";
import { ActorService } from "../actor/actor-service";
import { CharacterPoseService } from "../character/character-pose-service";
import { Logger } from "../log/logger";
import { PlayerStoreService } from "../player/player-store-service";
import { WardrobeConditionChecker } from "./wardrobe-condition-checker";

@singleton()
export class WardrobeService {
  constructor(
    @inject(PlayerStoreService)
    private playerStoreService: PlayerStoreService,
    @inject(WardrobeConditionChecker)
    private wardrobeConditionChecker: WardrobeConditionChecker,
    @inject(CharacterPoseValidator)
    private characterPoseValidator: CharacterPoseValidator,
    @inject(CharacterPoseService)
    private characterPoseService: CharacterPoseService,
    @inject(ActorService)
    private actorService: ActorService,
    @inject(Logger)
    private logger: Logger,
  ) {}

  async wear(params: {
    actor: Actor;
    target: Actor;
    slot: Slot;
    item?: ItemReference | PhantomItem;
  }): Promise<void> {
    const { actor, target, item } =
      await this.wardrobeConditionChecker.assertCanWear({
        actor: params.actor,
        target: params.target,
        slot: params.slot,
        item: params.item,
      });
    const oldItem: EquippedItem | undefined =
      target.character.wearables[params.slot];
    const oldItemShouldGoToTarget =
      oldItem &&
      oldItem.ownerPlayerId &&
      oldItem.ownerPlayerId === target.playerId;
    const newEquippedItem: EquippedItem | undefined = item
      ? { item, ownerPlayerId: actor.playerId }
      : undefined;

    const changePoseResult = await this.changePoseIfNeeded(
      target,
      params.slot,
      newEquippedItem,
    );
    if (!changePoseResult) {
      this.logger.error("Cannot change pose so item won't be equipped");
      return;
    }

    if (isPlayerActor(actor.actor)) {
      if (oldItem && !oldItemShouldGoToTarget && isItem(oldItem.item)) {
        await this.playerStoreService.addItems(actor.actor.playerId, [
          oldItem.item,
        ]);
      }
      if (isItem(item)) {
        await this.playerStoreService.removeItemById(
          actor.actor.playerId,
          item.id,
        );
      }
    }
    if (oldItemShouldGoToTarget && !isPhantomItem(oldItem.item)) {
      await this.actorService.addItems(target.actor, [oldItem.item]);
    }
    await this.actorService.updateEquippedItem(
      target.actor,
      params.slot,
      newEquippedItem,
    );
    await this.actorService.synchronizeActorWithClient(actor.actor, {
      items: {
        add:
          oldItem && !oldItemShouldGoToTarget && !isPhantomItem(oldItem.item)
            ? [oldItem.item]
            : [],
        remove: isItem(item) ? [item.id] : [],
      },
    });
    await this.actorService.synchronizeActorWithClient(target.actor, {
      pose: target.character.pose,
      items: {
        add:
          oldItemShouldGoToTarget && !isPhantomItem(oldItem.item)
            ? [oldItem.item]
            : [],
      },
      wearables: [
        {
          slot: params.slot,
          equippedItem: newEquippedItem,
        },
      ],
    });
  }

  private async changePoseIfNeeded(
    actor: ActorData,
    slot: Slot,
    newEquippedItem: EquippedItem | undefined,
  ): Promise<boolean> {
    const newCharacter: Character = {
      ...actor.character,
      wearables: {
        ...actor.character.wearables,
        [slot]: newEquippedItem,
      },
    };
    const currentPose = actor.character.pose;
    if (this.characterPoseValidator.isPoseValid(newCharacter, currentPose)) {
      const preferablePose = this.getPreferablePoseThatWasPreviouslyInvalid(
        actor.character,
        newCharacter,
      );
      if (preferablePose) {
        await this.characterPoseService.updatePose(actor, preferablePose);
      }
      return true;
    }
    if (!this.characterPoseValidator.isAnyValidPose(newCharacter)) {
      return false;
    }
    const newPose = this.getNewValidPose(newCharacter);
    await this.characterPoseService.updatePose(actor, newPose);
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
            requiredPoses.lowerBody,
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
    requiredPoses?: LowerBodyPose[],
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

  private getPreferablePoseThatWasPreviouslyInvalid(
    oldCharacter: Character,
    newCharacter: Character,
  ): CharacterPose | undefined {
    let pose = this.getPreferableHeadPoseThatWasPreviouslyInvalid(
      oldCharacter,
      newCharacter,
    );
    pose = this.getPreferableLowerBodyPoseThatWasPreviouslyInvalid(
      oldCharacter,
      {
        ...newCharacter,
        pose,
      },
    );

    return areCharacterPosesEqual(pose, newCharacter.pose) ? undefined : pose;
  }

  private getPreferableHeadPoseThatWasPreviouslyInvalid(
    oldCharacter: Character,
    newCharacter: Character,
  ): CharacterPose {
    if (newCharacter.pose.head === HeadPose.WideOpen) {
      const pose = {
        ...newCharacter.pose,
        head: HeadPose.Normal,
      };
      if (this.wasPoseInvalidAndNowIsValid(pose, oldCharacter, newCharacter)) {
        return pose;
      }
    }
    return newCharacter.pose;
  }

  private getPreferableLowerBodyPoseThatWasPreviouslyInvalid(
    oldCharacter: Character,
    newCharacter: Character,
  ): CharacterPose {
    if (!isStandardCharacterPose(newCharacter.pose)) {
      return newCharacter.pose;
    }

    if (newCharacter.pose.lowerBody === LowerBodyPose.StandHeels) {
      const pose = {
        ...newCharacter.pose,
        lowerBody: LowerBodyPose.Stand,
      };
      if (this.wasPoseInvalidAndNowIsValid(pose, oldCharacter, newCharacter)) {
        return pose;
      }
    } else if (newCharacter.pose.lowerBody === LowerBodyPose.WideLegsHeels) {
      const pose = {
        ...newCharacter.pose,
        lowerBody: LowerBodyPose.WideLegs,
      };
      if (this.wasPoseInvalidAndNowIsValid(pose, oldCharacter, newCharacter)) {
        return pose;
      }
    }

    return newCharacter.pose;
  }

  private wasPoseInvalidAndNowIsValid(
    pose: CharacterPose,
    oldCharacter: Character,
    newCharacter: Character,
  ): boolean {
    return (
      !this.characterPoseValidator.isPoseValid(oldCharacter, pose) &&
      this.characterPoseValidator.isPoseValid(newCharacter, pose)
    );
  }
}
