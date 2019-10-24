import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";

@customElement("blood-widget")
export class BloodWidget extends LitElement {
  constructor() {
    super();
  }
  render(): TemplateResult {
    const url = "https://www.kenketsu.jp";
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
      <a href=${url} target="_blank">
        <i class="material-icons md-48 md-dark">
          opacity
        </i>
      </a>
    `;
  }
}
