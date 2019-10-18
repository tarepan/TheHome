import { DateTime as dt, Duration } from "luxon";
import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { fetchSleeps } from "./requestSleeps";
import { weightIcon } from "./renderIcon";

@customElement("sleep-widget")
export class SleepWidget extends LitElement {
  @property({ type: Number }) wakeup = 0;
  @property({ type: Number }) sleepLength = 0;
  constructor() {
    super();
    setTimeout(
      ((): void => {
        this.updateSleep();
        setInterval(this.updateSleep.bind(this), 5 * 60 * 1000);
      }).bind(this),
      3 * 1000
    );
  }
  /**
   * Update number of mail based on Gmail server
   */
  private async updateSleep(): Promise<void> {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    const resSleeps = isSignedIn
      ? await fetchSleeps(gapi)
      : ([[0, 0]] as [number, number][]);
    const lastSleep = resSleeps[resSleeps.length - 1];
    this.wakeup = lastSleep[0];
    this.sleepLength = lastSleep[1];
  }
  render(): TemplateResult {
    const url =
      "https://docs.google.com/spreadsheets/d/1tPqJlHvR7pu3q4idv2zyYC435eHPVsL7Vn0Q1YCgvt0";
    const sLength = Duration.fromObject({
      hours: 0,
      minutes: 0,
      milliseconds: this.sleepLength
    }).normalize();
    return html`
      <style>
        @import url("https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css");
        @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP|Roboto&display=swap");
        div {
          /* Roboto do NOT contain JP => JP is "NotoSansJP" */
          font-family: "Roboto", "Noto Sans JP", sans-serif;
        }
      </style>
      <section>
        <a href=${url} target="_blank">
          <h3>
            wakeup at
            ${dt.fromMillis(this.wakeup).toLocaleString(dt.TIME_24_SIMPLE)}
          </h3>
          <h3>length: ${sLength.hours}h ${sLength.minutes}m</h3>
        </a>
      </section>
    `;
  }
}
