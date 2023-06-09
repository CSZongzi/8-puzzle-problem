export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export enum Stage {
  Initialized,
  LuckyDogSelecting,
  Solvable,
  NotSolvable,
  ManualControl,
  UninformedSearching,
  AStarSearching,
  SearchEnd,
  PlayingSolution,
}

export type GlobalState = {
  stage: Stage;
  steps: number;
  solution: string[];
  spaceConsumption: number;
  timeConsumption: number;
  lucky: number;
  initial: string;
  target: string;
  current: string;
  x: [null, number, number, number, number, number, number, number, number, number];
  y: [null, number, number, number, number, number, number, number, number, number];
  backgrounds: [string, string, string, string, string, string, string, string, string];
};
