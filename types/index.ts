export type ProblemType =
  | "Add Three Numbers"
  | "Multiply Two Numbers"
  | "Multiply and Divide"
  | "Random";

export interface Range {
  min: number;
  max: number;
}

export interface Score {
  correct: number;
  total: number;
}
