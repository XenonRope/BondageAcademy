import { DictionaryKey, NPCCode } from "@bondage-academy/bondage-academy-model";

export interface ScriptEventEmitters {
  onPlayerJoinRoom: Array<(event: PlayerJoinRoomEvent) => Promise<void>>;
  onDialogueOptionUse: Array<(event: DialogueOptionUseEvent) => Promise<void>>;
}

export interface PlayerJoinRoomEvent {
  playerId: number;
  roomId: number;
}

export interface DialogueOptionUseEvent {
  playerId: number;
  roomId: number;
  npcCode: NPCCode;
  content: DictionaryKey;
}
