export enum FullBodyPose {
  PetSuit = "PetSuit",
}

export const FULL_BODY_POSES = Object.keys(FullBodyPose) as FullBodyPose[];

export const isFullBodyPose = (pose: AnyPose): pose is FullBodyPose =>
  pose in FullBodyPose;

export enum UpperBodyPose {
  Attention = "Attention",
  Crossed = "Crossed",
  HandsUp = "HandsUp",
}

export const UPPER_BODY_POSES = Object.keys(UpperBodyPose) as UpperBodyPose[];

export const isUpperBodyPose = (pose: AnyPose): pose is UpperBodyPose =>
  pose in UpperBodyPose;

export enum LowerBodyPose {
  Stand = "Stand",
  StandHeels = "StandHeels",
  WideLegs = "WideLegs",
  WideLegsHeels = "WideLegsHeels",
  SimpleKneel = "SimpleKneel",
  WideKneel = "WideKneel",
}

export const LOWER_BODY_POSES = Object.keys(LowerBodyPose) as LowerBodyPose[];

export const isLowerBodyPose = (pose: AnyPose): pose is LowerBodyPose =>
  pose in LowerBodyPose;

export enum HeadPose {
  Normal = "Normal",
  WideOpen = "WideOpen",
}

export const isHeadPose = (pose: AnyPose): pose is HeadPose => pose in HeadPose;

export type AnyPose = FullBodyPose | UpperBodyPose | LowerBodyPose | HeadPose;

export interface StandardCharacterPose {
  upperBody: UpperBodyPose;
  lowerBody: LowerBodyPose;
  head: HeadPose;
}

export const isStandardCharacterPose = (
  pose: CharacterPose,
): pose is StandardCharacterPose =>
  "upperBody" in pose && pose.upperBody != null;

export interface FullBodyCharacterPose {
  fullBody: FullBodyPose;
  head: HeadPose;
}

export const isFullBodyCharacterPose = (
  pose: CharacterPose,
): pose is FullBodyCharacterPose => "fullBody" in pose && pose.fullBody != null;

export type CharacterPose = StandardCharacterPose | FullBodyCharacterPose;

export const areCharacterPosesEqual = (
  first: CharacterPose,
  second: CharacterPose,
): boolean => {
  if (isStandardCharacterPose(first) && isStandardCharacterPose(second)) {
    return (
      first.upperBody === second.upperBody &&
      first.lowerBody === second.lowerBody &&
      first.head === second.head
    );
  }
  if (isFullBodyCharacterPose(first) && isFullBodyCharacterPose(second)) {
    return first.fullBody === second.fullBody && first.head === second.head;
  }
  return false;
};
