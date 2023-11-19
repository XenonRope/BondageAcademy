export enum FullBodyPose {
  PetSuit = "PetSuit",
}

export enum UpperBodyPose {
  Attention = "Attention",
  Crossed = "Crossed",
}

export enum LowerBodyPose {
  Stand = "Stand",
  SimpleKneel = "SimpleKneel",
  WideKneel = "WideKneel",
}

export enum HeadPose {
  Normal = "Normal",
  WideOpen = "WideOpen",
}

export type AnyPose = FullBodyPose | UpperBodyPose | LowerBodyPose | HeadPose;

export type CharacterPose = (
  | { fullBody: FullBodyPose }
  | { upperBody: UpperBodyPose; lowerBody: LowerBodyPose }
) & { head: HeadPose };
