import { SleepHistroy } from "./domain";

/**
 * Fecth sleep logs
 * @param gapi
 * @return [wakeupUnixTime, sleepLengthUnixTime]
 */
export async function fetchSleeps(gapi: any): Promise<SleepHistroy> {
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1tPqJlHvR7pu3q4idv2zyYC435eHPVsL7Vn0Q1YCgvt0",
    range: "'シート1'!A:C"
  });
  // [wakeupUNIX, sleepLengthUnix]
  return (res.result.values as [string, string, string][])
    .slice(1)
    .filter(record => record.length === 3)
    .map(record => [parseInt(record[0]), parseInt(record[2])])
    .map(record => [record[1], record[1] - record[0]]);
}
