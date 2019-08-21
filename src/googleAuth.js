// Configs
var CLIENT_ID =
  "830847602052-os8qbsv2iot82jeq8tliiorl1iocp7et.apps.googleusercontent.com";
var API_KEY = "AIzaSyABSPbwZGzgGnWt-xQAmHkkZsViaz91yt8";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
var SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

async function handleClientLoad() {
  // Load client library, OAuth2 library
  await new Promise((resolve, reject) => gapi.load("client:auth2", resolve));

  // Initialzie client library
  await gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .catch(err => {
      console.log(JSON.stringify(err, null, 2));
      throw "login error";
    });

  // Attach event handler for sign-in state changes.
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Attach listener for sign-in/out button
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  authorizeButton.onclick = event => gapi.auth2.getAuthInstance().signIn();
  signoutButton.onclick = event => gapi.auth2.getAuthInstance().signOut();
}

async function updateSigninStatus(isSignedIn) {
  authorizeButton.style.display = isSignedIn ? "none" : "block";
  signoutButton.style.display = isSignedIn ? "block" : "none";
}

(async () => {
  await handleClientLoad();
})();
