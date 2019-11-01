import { DateTime as dt } from "luxon";
import { WeightHistory, WeightRecord } from "./domain";
/**
 * Count remaining GMail's mails with API query.
 * @param {*} gapi
 */
export async function fetchWeight(gapi: any): Promise<WeightHistory> {
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1iLT4X-1FCByjLxG1jwQVuBJnit5BP9LYe99vxyg9Rh8",
    range: "'シート1'!A:B"
  });
  return res.result.values.map(
    (record: [string, string]) =>
      [
        dt.fromFormat(record[0], "LLLL d, yyyy 'at' hh:mma").toMillis(),
        parseFloat(record[1])
      ] as WeightRecord
  );
}
