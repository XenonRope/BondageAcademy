export enum MinigameWinner {
  Agent = "Agent",
  Target = "Target",
}

export interface MinigameResult {
  winner?: MinigameWinner;
}
