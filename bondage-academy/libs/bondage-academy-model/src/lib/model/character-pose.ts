export enum FullBodyPose {
  PetSuit = "PetSuit",
}

export enum UpperBodyPose {
  Attention = "Attention",
  Crossed = "Crossed",
  HandsUp = "HandsUp",
}

export enum LowerBodyPose {
  Stand = "Stand",
  WideLegs = "WideLegs",
  SimpleKneel = "SimpleKneel",
  WideKneel = "WideKneel",
}

export enum HeadPose {
  Normal = "Normal",
  WideOpen = "WideOpen",
}

export type AnyPose = FullBodyPose | UpperBodyPose | LowerBodyPose | HeadPose;

export type CharacterPose = {
  fullBody?: FullBodyPose;
  upperBody?: UpperBodyPose;
  lowerBody?: LowerBodyPose;
  head: HeadPose;
};
