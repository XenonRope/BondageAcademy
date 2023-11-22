export interface ScriptEventEmitters {
  onPlayerJoinRoom: Array<(event: PlayerJoinRoomEvent) => Promise<void>>;
}

export interface PlayerJoinRoomEvent {
  playerId: number;
  roomId: number;
}
