import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { DateTime } from "luxon";
import { dispatchNotification } from "../healthHub/health-hub";

type Meal = {
  date: number; // UNItime
  calory: number; // [kcal]
};

function extractCalory(content: string | undefined): number {
  if (content === undefined) {
    // default calory for meal
    return 500;
  } else {
    const template = /\s*(\d+)\s*kcal\s*/;
    const result = template.exec(content);
    return result && result.length >= 2 ? parseInt(result[1]) : 0;
  }
}
/**
 * Count meals in Google Calendar.
 * Yesterday meals (("少食" | "食") && green event) are counted.
 */
async function fetchYesterdayMeals(): Promise<Meal[]> {
  const now = DateTime.local();
  //@ts-ignore
  const response: gapi.client.Response<gapi.client.calendar.Events> = await gapi.client.calendar.events.list(
    {
      calendarId: "primary",
      alwaysIncludeEmail: false,
      maxResults: 100,
      orderBy: "startTime",
      showDeleted: false,
      singleEvents: true,
      timeMin: now.minus({ days: 2 }).toISO(),
      timeMax: now.toISO()
    }
  );
  const yesterdayDay = now.day - 1;
  const events = response.result.items as gapi.client.calendar.Event[];
  return (
    events
      // green events
      .filter(evt => evt.colorId === "2")
      // yesterday events
      .filter(
        evt =>
          evt.start != undefined &&
          DateTime.fromISO(evt.start.dateTime as string).day === yesterdayDay
      )
      .filter(evt => evt.summary === "少食" || evt.summary === "食")
      .map(evt => ({
        date: DateTime.fromISO(evt.start?.dateTime as string).toMillis(),
        calory: extractCalory(evt.description)
      }))
  );
}

function countMeals(meals: Meal[]): number {
  return meals.length;
}

function countCalory(meals: Meal[]): number {
  return meals.reduce((total, meal) => total + meal.calory, 0);
}

/**
 * Widget which evaluate meal/eating habits.
 * Default-color (no colorId attribute) & non-execluded-color events are counted.
 * You can access the number by attribute access from out of this component.
 */
@customElement("meal-widget")
export class MealWidget extends LitElement {
  @property({ type: Boolean }) isGood = true;
  @property({ type: Number }) calory = 10000;
  constructor() {
    super();
    setTimeout(this.updateCount.bind(this), 3000);
    const intervalMin = 60 * 1;
    setInterval(this.updateCount.bind(this), intervalMin * 60 * 1000);
  }
  async updateCount(): Promise<void> {
    const meals = await fetchYesterdayMeals().catch(() => []);
    const count = countMeals(meals);
    this.calory = countCalory(meals);
    this.isGood = count >= 3 && this.calory <= 2000;
    dispatchNotification(this, !this.isGood);
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
          class="material-icons md-48 md-dark ${this.isGood
            ? "md-inactive"
            : ""}"
        >
          fastfood
        </i>
      </a>
    `;
  }
}
