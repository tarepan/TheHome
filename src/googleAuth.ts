// Configs
const CLIENT_ID =
  "830847602052-os8qbsv2iot82jeq8tliiorl1iocp7et.apps.googleusercontent.com";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly";

const authorizeButton = document.getElementById(
  "authorize_button"
) as HTMLButtonElement;
const signoutButton = document.getElementById(
  "signout_button"
) as HTMLButtonElement;

async function updateSigninStatus(isSignedIn: boolean): Promise<void> {
  authorizeButton.style.display = isSignedIn ? "none" : "block";
  signoutButton.style.display = isSignedIn ? "block" : "none";
}

async function handleClientLoad(): Promise<void> {
  // Load client library, OAuth2 library
  await new Promise((resolve): void => gapi.load("client:auth2", resolve));
  // Initialzie client library
  await gapi.client
    .init({
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .catch(err => {
      console.log(JSON.stringify(err, null, 2));
      throw "login error";
    });

  // auth2 is attached to window.gapi in above client initialization.
  // Attach event handler for sign-in state changes.
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Attach listener for sign-in/out button
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  authorizeButton.onclick = (): Promise<gapi.auth2.GoogleUser> =>
    gapi.auth2.getAuthInstance().signIn();
  signoutButton.onclick = (): void => gapi.auth2.getAuthInstance().signOut();
}

(async (): Promise<void> => {
  await handleClientLoad();
})();
