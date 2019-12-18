import { DateTime as dt, Duration } from "luxon";
import { LitElement, html, customElement, property } from "lit-element";
import { fetchSleeps } from "./requestSleeps";
import {
  histroy2Wakeup,
  history2Length,
  SleepHistroy,
  history2wasGoodWakeup
} from "./domain";
import { dispatchNotification } from "../healthHub/health-hub";
import { sleepIcon } from "./renderIcon";

@customElement("sleep-widget")
export class SleepWidget extends LitElement {
  @property({ type: String }) wakeup = "00:00";
  @property({ type: Number }) lengthHours = 0;
  @property({ type: Number }) lengthMinutes = 0;
  @property({ type: Boolean }) isGoodWakeUp = false;

  constructor() {
    super();
    // timeout for google auth
    setTimeout(this.refreshHistory.bind(this), 3 * 1000);
    setInterval(this.refreshHistory.bind(this), 5 * 60 * 1000);
  }
  async refreshHistory() {
    const history = await fetchHistory();

    // history to index
    const wakeup = dt
      .fromMillis(histroy2Wakeup(history))
      .toLocaleString(dt.TIME_24_SIMPLE);

    const sLength = Duration.fromObject({
      hours: 0,
      minutes: 0,
      milliseconds: history2Length(history)
    }).normalize();
    const lengthHours = sLength.hours;
    const lengthMinutes = sLength.minutes;

    const isGoodWakeup = history2wasGoodWakeup(history, 10, 0);

    // notify status
    dispatchNotification(this, !isGoodWakeup);

    // update UI
    this.wakeup = wakeup;
    this.lengthHours = lengthHours;
    this.lengthMinutes = lengthMinutes;
    this.isGoodWakeUp = isGoodWakeup;
  }
  render() {
    const url = "https://calendar.google.com/calendar/r/week";
    return html`
      <style>
        @import url("https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css");
        @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP|Roboto&display=swap");
        @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
        div {
          /* Roboto do NOT contain JP => JP is "NotoSansJP" */
          font-family: "Roboto", "Noto Sans JP", sans-serif;
        }
        a {
          text-decoration: none;
        }
        .material-icons.md-48 {
          font-size: 48px;
        }
        .material-icons.md-dark {
          color: rgba(0, 0, 0, 1);
        }
        .material-icons.md-dark.md-inactive {
          color: rgba(0, 0, 0, 0.26);
        }
      </style>
      <div>
        <a href=${url} target="_blank" rel="noopener">
          ${sleepIcon(
            this.wakeup,
            this.lengthHours,
            this.lengthMinutes,
            this.isGoodWakeUp
          )}
        </a>
      </div>
      <div id="hook"></div>
    `;
  }
}

async function fetchHistory(): Promise<SleepHistroy> {
  // SignIn check
  console.log("gapi:");
  console.log(gapi);
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  return isSignedIn ? await fetchSleeps(gapi) : ([[0, 0]] as SleepHistroy);
}
