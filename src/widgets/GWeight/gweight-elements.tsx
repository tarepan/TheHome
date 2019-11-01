import { DateTime as dt, Interval } from "luxon";
import { LitElement, html, customElement } from "lit-element";
import React from "react";
import ReactDOM from "react-dom";
import { fetchWeight } from "./requestWeight";
import { WeightIcon } from "./WeightIcon";
import {
  WeightHistory,
  history2weight,
  history2DeltaW,
  history2DeltaWPercent
} from "./domain";

@customElement("gweight-widget")
export class GWeightWidget extends LitElement {
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
    const hookElem = this.shadowRoot
      ? this.shadowRoot.querySelector("#hook")
      : null;
    ReactDOM.render(<WeightReactWidget />, hookElem);
  }
}

const useWeightHistory = () => {
  const [isFirst, setIsFirst] = React.useState(true);
  const [history, setHistory] = React.useState([[0, 0]] as WeightHistory);
  React.useEffect(() => {
    const id = setTimeout(
      () => {
        // SignIn check
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        // fetch
        (async () => {
          const sleepHistory = isSignedIn
            ? await fetchWeight(gapi)
            : ([[0, 0]] as WeightHistory);
          setHistory(sleepHistory);
          setIsFirst(false);
        })();
      },
      isFirst ? 3 * 1000 : 1 * 60 * 1000
    );
    return () => clearTimeout(id);
  });
  return history;
};

const WeightReactWidget: React.FC = props => {
  const history = useWeightHistory();
  return <WeightIndexes weightHistory={history} />;
};

const WeightIndexes: React.FC<{ weightHistory: WeightHistory }> = props => {
  const weight = history2weight(props.weightHistory);
  const delta = history2DeltaW(props.weightHistory);
  const deltaPercent = history2DeltaWPercent(props.weightHistory);
  return (
    <WeightIcon
      weightLatest={weight}
      deltaWeekly={delta}
      deltaWPercent={deltaPercent}
    />
  );
};
