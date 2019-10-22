import { DateTime as dt, Duration } from "luxon";
import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { fetchSleeps } from "./requestSleeps";

@customElement("sleep-widget")
export class SleepWidget extends LitElement {
  @property({ type: Number }) wakeup = 0;
  @property({ type: Number }) sleepLength = 0;
  @property({ type: Boolean }) goodWakeup = false;
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
      <section>
        <a href=${url} target="_blank" rel="noopener">
          <div>
            <i
              class="material-icons md-48 md-dark ${this.goodWakeup == true
                ? "md-inactive"
                : ""}"
            >
              airline_seat_recline_normal
            </i>
            <h3>
              ${dt.fromMillis(this.wakeup).toLocaleString(dt.TIME_24_SIMPLE)}
              (${sLength.hours}h ${sLength.minutes}m)
            </h3>
          </div>
        </a>
      </section>
    `;
  }
}
