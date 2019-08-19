import { html, render } from "https://unpkg.com/lit-html?module";

/**
 * Count remaining GMail's mails with API query.
 * @param {*} gapi
 */
export async function countInboxMail(gapi) {
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

/**
 * Update html elements which contains number of mails.
 * @param {*} gapi
 */
export async function updateNInbox(gapi) {
  // Get inbox mail number from Gmail server.
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  const NInbox = isSignedIn
    ? await countInboxMail(gapi)
    : "Please Sign-in Google";
  const imgURL = NInbox != 0 ? "New_Logo_Gmail.svg" : "New_Logo_Gmail_blue.svg";
  render(
    html`
      <section>
        <a href="https://gmail.com">
          <img src=${imgURL} />
        </a>
        <h3>inbox: ${NInbox}</h3>
      </section>
    `,
    document.body.querySelector("#inbox1")
  );
}
