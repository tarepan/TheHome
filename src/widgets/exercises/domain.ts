import { DateTime as dt, Interval } from "luxon";

// domain: ExerciseHistroy => exercise indexes

type StartUNIXtime = number;
type LengthMin = number;

// data
export type ExerciseRecord = [StartUNIXtime, LengthMin];
export type ExerciseHistroy = ExerciseRecord[];

// indexes
type Latest24Count = number;
type Latest24Length = LengthMin;
type WasGoodExercise = boolean;

// behaviors
type History2Latest24Count = (exercise: ExerciseHistroy) => Latest24Count;
type History2Latest24Length = (exercise: ExerciseHistroy) => Latest24Length;
type Histroy2WasGoodExercise = (
  sleeps: ExerciseHistroy,
  targetCount: StartUNIXtime,
  targetMin: LengthMin
) => WasGoodExercise;

// implementations
export const history2Latest24Count: History2Latest24Count = exercise =>
  exercise.filter(record =>
    Interval.fromDateTimes(dt.local().minus({ days: 1 }), dt.local()).contains(
      dt.fromMillis(record[0])
    )
  ).length;
export const history2Latest24Length: History2Latest24Length = exercise =>
  exercise
    .filter(record =>
      Interval.fromDateTimes(
        dt.local().minus({ days: 1 }),
        dt.local()
      ).contains(dt.fromMillis(record[0]))
    )
    .reduce((total, record) => total + record[1], 0);
export const histroy2WasGoodExercise: Histroy2WasGoodExercise = (
  history,
  targetCount,
  targetMin
) =>
  history2Latest24Count(history) >= targetCount &&
  history2Latest24Length(history) >= targetMin;
