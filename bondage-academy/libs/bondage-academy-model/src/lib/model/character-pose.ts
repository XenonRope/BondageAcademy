export enum FullBodyPose {
  PetSuit = "PetSuit",
}

export const isFullBodyPose = (pose: AnyPose): pose is FullBodyPose =>
  pose in FullBodyPose;

export enum UpperBodyPose {
  Attention = "Attention",
  Crossed = "Crossed",
  HandsUp = "HandsUp",
}

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

export const isLowerBodyPose = (pose: AnyPose): pose is LowerBodyPose =>
  pose in LowerBodyPose;

export enum HeadPose {
  Normal = "Normal",
  WideOpen = "WideOpen",
}

export const isHeadPose = (pose: AnyPose): pose is HeadPose => pose in HeadPose;

export type AnyPose = FullBodyPose | UpperBodyPose | LowerBodyPose | HeadPose;

export type CharacterPose = {
  fullBody?: FullBodyPose;
  upperBody?: UpperBodyPose;
  lowerBody?: LowerBodyPose;
  head: HeadPose;
};
