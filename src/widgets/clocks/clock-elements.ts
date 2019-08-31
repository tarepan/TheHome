import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";

@customElement("clock-widget")
export class ClockWidget extends LitElement {
  @property({ type: String }) nowStg = new Date().toLocaleString();
  constructor() {
    super();
    setInterval(this.updateClock.bind(this), 1000);
  }
  updateClock(): void {
    this.nowStg = new Date().toLocaleString();
  }
  render(): TemplateResult {
    return html`
      <style>
        @import url("https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css");
        @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP|Roboto&display=swap");
        div {
          /* Roboto do NOT contain JP => JP is "NotoSansJP" */
          font-family: "Roboto", "Noto Sans JP", sans-serif;
        }
      </style>
      <div class="mdc-card">
        <h2>${this.nowStg}</h2>
      </div>
    `;
  }
}
