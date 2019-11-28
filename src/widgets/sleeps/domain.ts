import { DateTime as dt, Duration } from "luxon";

// domain: sleepHistroy => sleep indexes

type wakeupUNIXtime = number;
// e.g. 1572534000000 for "2019-11-01T00:00:00+09:00"
type sleepLengthUNIXtime = number;
// e.g. 25200000 for "just 7 hours"

// data
export type SleepRecord = [wakeupUNIXtime, sleepLengthUNIXtime];
export type SleepHistroy = SleepRecord[];

// indexes
type latestWakeupUNIXtime = number;
type latestLengthUNIXtime = number;
type wasGoodWakeup = boolean;

// behaviors
type history2latestWakeup = (sleeps: SleepHistroy) => latestWakeupUNIXtime;
type history2latestLength = (sleeps: SleepHistroy) => latestLengthUNIXtime;
type histroy2latestEvaluation = (
  sleeps: SleepHistroy,
  targetHour: number,
  targetMinute: number
) => wasGoodWakeup;

// implementations
export const histroy2Wakeup: history2latestWakeup = history =>
  history[history.length - 1][0];

export const history2Length: history2latestLength = history =>
  history[history.length - 1][1];

export const history2wasGoodWakeup: histroy2latestEvaluation = (
  history,
  targetWakeupHour,
  targetWakeupMin
) => {
  const latestSleep = history[history.length - 1];
  const wakeupDT = dt.fromMillis(latestSleep[0]);
  const overWakeupHour = wakeupDT.hour - targetWakeupHour;
  const overWakeupMin = wakeupDT.minute - targetWakeupMin;
  return overWakeupHour < 0 || (overWakeupHour == 0 && overWakeupMin <= 0);
};

// console.log(history2wasGoodWakeup([[1572562800000, 25200000]], 7, 59));

// future: sleep length evaluation
