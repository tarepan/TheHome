import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import {
  history2Latest24Count,
  history2Latest24Length,
  histroy2WasGoodExercise,
  ExerciseHistroy
} from "./domain";
import { dispatchNotification } from "../healthHub/health-hub";
import { exerciseIcon } from "./renderIcon";
import { fetchExercises } from "./requestExercises";

async function fetchHistory(): Promise<ExerciseHistroy> {
  // SignIn check
  console.log("gapi:");
  console.log(gapi);
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  return isSignedIn ? await fetchExercises(gapi) : [[0, 0]];
}

@customElement("exercise-widget")
export class ExerciseWidget extends LitElement {
  @property({ type: Number }) latest24Count = 0;
  @property({ type: Number }) latest24Length = 0;
  @property({ type: Boolean }) wasGoodExercise = false;

  constructor() {
    super();
    // timeout for google auth
    setTimeout(this.refreshHistory.bind(this), 3 * 1000);
    setInterval(this.refreshHistory.bind(this), 5 * 60 * 1000);
  }
  async refreshHistory(): Promise<void> {
    const history = await fetchHistory();

    // history to index
    const latest24Count = history2Latest24Count(history);
    const latest24Length = history2Latest24Length(history);
    const wasGoodExercise = histroy2WasGoodExercise(history, 1, 30);
    // notify status
    dispatchNotification(this, !wasGoodExercise);

    // update UI
    this.latest24Count = latest24Count;
    this.latest24Length = latest24Length;
    this.wasGoodExercise = wasGoodExercise;
  }
  render(): TemplateResult {
    const url = "https://calendar.google.com/calendar/r/week";
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
      <div>
        <a href=${url} target="_blank" rel="noopener">
          ${exerciseIcon(
            this.latest24Count,
            this.latest24Length,
            this.wasGoodExercise
          )}
        </a>
      </div>
      <div id="hook"></div>
    `;
  }
}
