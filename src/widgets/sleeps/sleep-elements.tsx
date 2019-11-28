import { DateTime as dt, Duration } from "luxon";
import { LitElement, html, customElement } from "lit-element";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { fetchSleeps } from "./requestSleeps";
import {
  histroy2Wakeup,
  history2Length,
  SleepHistroy,
  history2wasGoodWakeup
} from "./domain";

@customElement("sleep-widget")
export class SleepWidget extends LitElement {
  reactAnchor: Element | null;
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

    // update UI
    ReactDOM.render(
      <SleepIcon
        wakeup={wakeup}
        lengthHours={lengthHours}
        lengthMinutes={lengthMinutes}
        isGoodWakeUp={isGoodWakeup}
      />,
      this.reactAnchor
    );
  }
  render() {
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
      <div id="hook"></div>
    `;
  }
  firstUpdated() {
    this.reactAnchor = this.shadowRoot?.querySelector("#hook") ?? null;
  }
}

async function fetchHistory(): Promise<SleepHistroy> {
  // SignIn check
  console.log("gapi:");
  console.log(gapi);
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  return isSignedIn ? await fetchSleeps(gapi) : ([[0, 0]] as SleepHistroy);
}

interface SleepIconProps {
  wakeup: string;
  lengthHours: number;
  lengthMinutes: number;
  isGoodWakeUp: boolean;
}
const SleepIcon: React.FC<SleepIconProps> = props => {
  const url =
    "https://docs.google.com/spreadsheets/d/1tPqJlHvR7pu3q4idv2zyYC435eHPVsL7Vn0Q1YCgvt0";
  return (
    <>
      <a href={url} target="_blank" rel="noopener">
        <i
          className={`material-icons md-48 md-dark ${
            props.isGoodWakeUp ? "md-inactive" : ""
          }`}
        >
          airline_seat_recline_normal
        </i>
        <h3>
          {props.wakeup} ({props.lengthHours}h {props.lengthMinutes}m)
        </h3>
      </a>
    </>
  );
};
