import { LitElement, html, customElement, property } from "lit-element";

const NotificationEventName = "panda:notification";
interface NotificationDetail {
  nodeName: string; // UPPERCASE
  hasNotification: boolean;
}
type NotificationEvent = CustomEvent<NotificationDetail>;
// notification for NotifHub
export const dispatchNotification = (
  elem: Element,
  hasNotification: boolean
): void => {
  const evt = new CustomEvent<NotificationDetail>(NotificationEventName, {
    bubbles: true,
    composed: true,
    detail: {
      nodeName: elem.nodeName,
      hasNotification: hasNotification
    }
  });
  elem.dispatchEvent(evt);
};

@customElement("health-hub")
export class HealthHub extends LitElement {
  @property({ type: Boolean }) showNotification = false;
  notifications: Map<string, boolean> = new Map<string, boolean>();
  // UNIXtime
  lastChecked: number = 0;
  constructor() {
    super();
    // set event handler
    this.addEventListener(NotificationEventName, (evt: NotificationEvent) => {
      console.log(
        `notification recieved: ${evt.detail.nodeName} ${
          evt.detail.hasNotification ? "true" : "false"
        }`
      );
      this.notifications.set(evt.detail.nodeName, evt.detail.hasNotification);
      this.updateShowNotif();
    });
  }
  updateShowNotif(): void {
    const allNoNotif: boolean = Array.from(this.notifications.values()).every(
      isNotif => !isNotif
    );
    const checkRecently: boolean =
      Date.now() - this.lastChecked < 12 * 60 * 60 * 1000;
    this.showNotification = !allNoNotif && !checkRecently;
  }
  updateToggle(): void {
    this.lastChecked = Date.now();
    this.updateShowNotif();
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
      <details @click="${this.updateToggle}">
        <summary>
          <i
            class="material-icons md-48 md-dark ${this.showNotification
              ? ""
              : "md-inactive"}"
          >
            favorite
          </i>
        </summary>
        <slot></slot>
      </details>
    `;
  }
}
