import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { DateTime } from "luxon";

// includes: default(no key), includes
// excludes: excludes
export async function countMatchedColorEvts(
  excludes: string[]
): Promise<number> {
  const now = DateTime.local();
  const response: gapi.client.Response<
    gapi.client.calendar.Events
    //@ts-ignore
  > = await gapi.client.calendar.events.list({
    // const response = await gapi.client.events.list({ // properly typed, but not work in browser (wrong .d.ts?)
    calendarId: "primary",
    alwaysIncludeEmail: false,
    maxResults: 100,
    orderBy: "startTime",
    showDeleted: false,
    singleEvents: true,
    timeMin: now.minus({ days: 2 }).toISO(),
    timeMax: now.toISO()
  });
  const events = response.result.items as gapi.client.calendar.Event[];
  const matchedColorEvts = events.filter(
    evt => !(evt.colorId !== undefined && excludes.includes(evt.colorId))
  );
  return matchedColorEvts.length;
}

/**
 * Widget which counts the number of Google Calendar events based on color.
 * Default-color (no colorId attribute) & non-execluded-color events are counted.
 * You can access the number by attribute access from out of this component.
 */
@customElement("remaining-diary-widget")
export class RemainingDiaryWidget extends LitElement {
  @property({ type: Array }) excludes = [];
  @property({ type: Number }) matched = 0;
  @property({ type: Number }) inboxCount = 0;
  constructor() {
    super();
    setTimeout(this.updateCount.bind(this), 3000);
    const intervalMin = 1;
    setInterval(this.updateCount.bind(this), intervalMin * 60 * 1000);
  }
  async updateCount(): Promise<void> {
    // "2": gray (sleep, move), "8": right-green (finished)
    this.matched = await countMatchedColorEvts(["2", "8"]);
    this.inboxCount = this.matched;
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
      <a
        href="https://calendar.google.com/calendar/r"
        target="_blank"
        rel="noopener"
      >
        <i
          class="material-icons md-48 md-dark ${this.inboxCount == 0
            ? "md-inactive"
            : ""}"
        >
          calendar_today
        </i>
      </a>
    `;
  }
}
