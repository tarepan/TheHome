import { DateTime as dt, Interval } from "luxon";
import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { fetchWeight } from "./requestWeight";
import { weightIcon } from "./renderIcon";

@customElement("gweight-widget")
export class GWeightWidget extends LitElement {
  @property({ type: Number }) weight = 0;
  @property({ type: String }) date = "";
  @property({ type: Number }) weight7dayAve = 0;
  constructor() {
    super();
    setTimeout(
      ((): void => {
        this.updateWeight();
        setInterval(this.updateWeight.bind(this), 1 * 60 * 1000);
      }).bind(this),
      3 * 1000
    );
  }
  /**
   * Update number of mail based on Gmail server
   */
  private async updateWeight(): Promise<void> {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    const res = isSignedIn
      ? await fetchWeight(gapi)
      : ([[0, 0]] as [number, number][]);
    const weights = res.map(
      record => [dt.fromMillis(record[0]), record[1]] as [dt, number]
    );

    this.date = weights[res.length - 1][0].toISO();
    this.weight = weights[res.length - 1][1];

    const last7days = weights
      .slice(0, -1)
      .filter(record =>
        Interval.fromDateTimes(
          dt.local().minus({ days: 7 }),
          dt.local()
        ).contains(record[0])
      );
    this.weight7dayAve =
      last7days.reduce((total, record) => total + record[1], 0) /
      last7days.length;
  }
  render(): TemplateResult {
    const target = 68;
    const url =
      "https://docs.google.com/spreadsheets/d/1iLT4X-1FCByjLxG1jwQVuBJnit5BP9LYe99vxyg9Rh8";
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
          <svg viewBox="0 0 520 520" width="100" height="100">
            ${weightIcon(this.weight)}
          </svg>
          <h5>until target: ${(target - this.weight).toFixed(1)} kg</h5>
          <h4>
            vs last 7 days: ${(this.weight - this.weight7dayAve).toFixed(1)} kg
            (${Math.round(
              ((this.weight - this.weight7dayAve) / this.weight7dayAve) * 100
            ).toFixed(0)}%)
          </h4>
        </a>
      </section>
    `;
  }
}
