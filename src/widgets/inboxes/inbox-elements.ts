import {
  LitElement,
  html,
  customElement,
  // property,
  TemplateResult
} from "lit-element";

@customElement("inbox-widget")
export class InboxWidget extends LitElement {
  constructor() {
    super();
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
      <div>
        <details>
          <summary>
            <h2>!inbox!</h2>
          </summary>
          <slot name="widget"><p>No widget</p></slot>
        </details>
      </div>
    `;
  }
}
