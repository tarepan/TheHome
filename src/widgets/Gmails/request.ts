/**
 * Count remaining GMail's mails with API query.
 * @param {*} gapi
 */
export async function countInboxMail(gapi: any): Promise<number> {
  const res = await gapi.client.gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    // "maxResults": 500,
    q: "-category:social -category:promotions"
  });
  return res.result.messages
    ? res.result.messages.length
    : res.result.resultSizeEstimate;
}
