export enum MinigameProgressChangeSource {
  Actor = "Actor",
  Target = "Targer",
}

export interface MinigameProgressChange {
  value: number;
  source: MinigameProgressChangeSource;
}
