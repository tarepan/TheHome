import {
  history2Latest24Count,
  history2Latest24Length,
  histroy2WasGoodExercise,
  ExerciseHistroy
} from "./domain";
import { DateTime as dt } from "luxon";

const dayMills = 24 * 60 * 60 * 1000;
const now = dt.local().toMillis();
const testHistory: ExerciseHistroy = [
  [now, 60], // latest 24
  [now - dayMills + 1000, 50], // latest 24
  [now - dayMills - 1, 30], // yesterday
  [now - 3 * dayMills - 1, 40] // 3 day before
];

test("history2Latest24Count", () => {
  expect(history2Latest24Count(testHistory)).toBe(2);
});

test("history2Latest24Length", () => {
  expect(history2Latest24Length(testHistory)).toBe(110);
});

test("histroy2WasGoodExercise", () => {
  expect(histroy2WasGoodExercise(testHistory, 1, 100)).toBe(true);
  expect(histroy2WasGoodExercise(testHistory, 2, 100)).toBe(true);
  expect(histroy2WasGoodExercise(testHistory, 3, 100)).toBe(false);
  expect(histroy2WasGoodExercise(testHistory, 2, 120)).toBe(false);
});
