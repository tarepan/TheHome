import { Interval, DateTime as dt } from "luxon";

// domain: weightHistroy => weight indexes

type DateUNIXtime = number;
type Weight = number;

// data
export type WeightRecord = [DateUNIXtime, Weight];
export type WeightHistory = WeightRecord[];

// indexes
type WeightLatest = number;
type WeightWeeklyAve = number;
type DeltaWeekly = number;
type DeltaPercentWeekly = number;

// behaviors
type History2latest = (history: WeightHistory) => WeightLatest;
type History2WeeklyAve = (history: WeightHistory) => WeightWeeklyAve;
type History2DeltaWeekly = (history: WeightHistory) => DeltaWeekly;
type History2DeltaPercentW = (history: WeightHistory) => DeltaPercentWeekly;

// implementation
export const history2weight: History2latest = history =>
  history[history.length - 1][1];

export const history2WeeklyAve: History2WeeklyAve = history => {
  const lastWeek = history.filter(record =>
    Interval.fromDateTimes(
      dt.local().minus({ days: 14 }),
      dt.local().minus({ days: 7 })
    ).contains(dt.fromMillis(record[0]))
  );
  // average array of each days
  const lastWeekEachDays = [...Array(7).keys()]
    .map(idx => {
      const inDays = lastWeek.filter(record =>
        Interval.fromDateTimes(
          dt.local().minus({ days: 7 + idx + 1 }),
          dt.local().minus({ days: 7 + idx })
        ).contains(dt.fromMillis(record[0]))
      );
      return !inDays.length
        ? 0
        : inDays.reduce((total, newRecord) => total + newRecord[1], 0) /
            inDays.length;
    })
    .filter(ave => ave != 0);
  return (
    lastWeekEachDays.reduce((total, dayAve) => total + dayAve, 0) /
    lastWeekEachDays.length
  );
};

export const history2DeltaW: History2DeltaWeekly = history => {
  const weightLatest = history2weight(history);
  const aveLastWeek = history2WeeklyAve(history);
  return weightLatest - aveLastWeek;
};

export const history2DeltaWPercent: History2DeltaPercentW = history => {
  const past = history2WeeklyAve(history);
  const delta = history2DeltaW(history);
  return (delta / past) * 100;
};

export const isGoodWeight = (history: WeightHistory): boolean => {
  const TARGET = 68;
  const TargetDeltaPercentWeekly = -1;
  const currentWeight = history2weight(history);
  const deltaPercent = history2DeltaWPercent(history);
  return (
    (currentWeight < TARGET && deltaPercent < 0.3) ||
    (currentWeight >= TARGET && deltaPercent < TargetDeltaPercentWeekly)
  );
};
