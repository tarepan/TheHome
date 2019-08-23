import { updateNInbox } from "./gmail/gmail";
// Update with interval
window.setTimeout(() => updateNInbox(gapi), 3 * 1000);
window.setInterval(() => updateNInbox(gapi), 1 * 60 * 1000);
