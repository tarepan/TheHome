/**
 * Count remaining GMail's mails with API query.
 * @param {*} gapi
 */
export async function fetchWeight(gapi: any): Promise<[string, number]> {
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1iLT4X-1FCByjLxG1jwQVuBJnit5BP9LYe99vxyg9Rh8",
    range: "'シート1'!A:B"
  });
  const weights = res.result.values;
  const latest = weights[weights.length - 1];
  return latest;
}
