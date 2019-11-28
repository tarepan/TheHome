import { LitElement, html, customElement } from "lit-element";
import React from "react";
import ReactDOM from "react-dom";
import { fetchWeight } from "./requestWeight";
import { WeightIcon } from "./WeightIcon";
import {
  WeightHistory,
  history2weight,
  history2DeltaW,
  history2DeltaWPercent,
  isGoodWeight
} from "./domain";
import { dispatchNotification } from "../healthHub/health-hub";

@customElement("gweight-widget")
export class GWeightWidget extends LitElement {
  reactAnchor: Element | null;
  constructor() {
    super();
    // timeout for google auth
    setTimeout(this.refreshHistory.bind(this), 3 * 1000);
    setInterval(this.refreshHistory.bind(this), 5 * 60 * 1000);
  }

  async refreshHistory() {
    const history = await fetchWeightHistory();

    // history to index
    const weight = history2weight(history);
    const delta = history2DeltaW(history);
    const deltaPercent = history2DeltaWPercent(history);
    const isGood = isGoodWeight(history);
    // notify status
    dispatchNotification(this, !isGood);

    // update UI
    ReactDOM.render(
      <WeightIcon
        weightLatest={weight}
        deltaWeekly={delta}
        deltaWPercent={deltaPercent}
      />,
      this.reactAnchor
    );
  }

  render() {
    const target = 68;
    return html`
      <style>
        @import url("https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css");
        @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP|Roboto&display=swap");
        div {
          /* Roboto do NOT contain JP => JP is "NotoSansJP" */
          font-family: "Roboto", "Noto Sans JP", sans-serif;
        }
      </style>
      <div id="hook"></div>
    `;
  }
  firstUpdated() {
    this.reactAnchor = this.shadowRoot?.querySelector("#hook") ?? null;
  }
}

async function fetchWeightHistory(): Promise<WeightHistory> {
  // SignIn check
  const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  return isSignedIn ? await fetchWeight(gapi) : ([[0, 0]] as WeightHistory);
}
