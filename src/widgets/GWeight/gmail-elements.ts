import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { fetchWeight } from "./requestWeight";

@customElement("gweight-widget")
export class GWeightWidget extends LitElement {
  @property({ type: Number }) weight = 0;
  @property({ type: String }) date = "";
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
      : (["", 0] as [string, number]);
    this.date = res[0];
    this.weight = res[1];
  }
  render(): TemplateResult {
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
          <div>${this.date}</div>
          <h3>${this.weight}</h3>
        </a>
      </section>
    `;
  }
}
