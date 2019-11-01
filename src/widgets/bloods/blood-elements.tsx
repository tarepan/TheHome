import { LitElement, html, customElement, TemplateResult } from "lit-element";
import React from "react";
import ReactDOM from "react-dom";

@customElement("blood-widget")
export class BloodWidget extends LitElement {
  render(): TemplateResult {
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
    const hookElem = this.shadowRoot
      ? this.shadowRoot.querySelector("#hook")
      : null;
    ReactDOM.render(<BloodReactWidget />, hookElem);
  }
}

const BloodReactWidget: React.FC = () => {
  const url = "https://www.kenketsu.jp";
  return (
    <a href={url} target="_blank">
      <i className="material-icons md-48 md-dark">opacity</i>
    </a>
  );
};
