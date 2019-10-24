import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { gmailIcon } from "./renderIcon";
import { countInboxMail } from "./request";

@customElement("gmail-widget")
export class GmailWidget extends LitElement {
  @property({ type: Number }) inboxCount = 0;
  constructor() {
    super();
    setTimeout(
      ((): void => {
        this.updateNMail();
        setInterval(this.updateNMail.bind(this), 1 * 60 * 1000);
      }).bind(this),
      3 * 1000
    );
  }
  /**
   * Update number of mail based on Gmail server
   */
  private async updateNMail(): Promise<void> {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    this.inboxCount = isSignedIn ? await countInboxMail(gapi) : 0;
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
      <section>
        <a href="https://gmail.com" target="_blank">
          <svg width="255" height="194">
            ${gmailIcon(this.inboxCount)}
          </svg>
        </a>
      </section>
    `;
  }
}

@customElement("gmail-icon-widget")
export class GmailIconWidget extends LitElement {
  @property({ type: Number }) inboxCount = 0;
  constructor() {
    super();
    setTimeout(
      ((): void => {
        this.updateNMail();
        setInterval(this.updateNMail.bind(this), 1 * 60 * 1000);
      }).bind(this),
      3 * 1000
    );
  }
  /**
   * Update number of mail based on Gmail server
   */
  private async updateNMail(): Promise<void> {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    this.inboxCount = isSignedIn ? await countInboxMail(gapi) : 0;
  }
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
      <a href="https://gmail.com" target="_blank" rel="noopener">
        <i
          class="material-icons md-48 md-dark ${this.inboxCount == 0
            ? "md-inactive"
            : ""}"
        >
          mail_outline
        </i>
      </a>
    `;
  }
}
