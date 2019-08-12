import { html, render } from "https://unpkg.com/lit-html?module";

// gapi should be initiated.
export async function count_inbox_mail(gapi_top) {
  const res = await gapi_top.client.gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    // "maxResults": 500,
    q: "-category:social -category:promotions"
  });
  console.log(res.result);
  return res.result.messages
    ? res.result.messages.length
    : res.result.resultSizeEstimate;
}

export async function update_N_inbox(gapi) {
  // Get inbox mail number from Gmail server.
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  const N_inbox = isSignedIn
    ? await count_inbox_mail(gapi)
    : "Please Sign-in Google";
  render(
    html`
      <section>
        <img src="New_Logo_Gmail.svg" />
        <h3>inbox: ${N_inbox}</h3>
      </section>
    `,
    document.body.querySelector("#inbox1")
  );
}
