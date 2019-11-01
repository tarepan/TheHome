import { DateTime as dt, Duration } from "luxon";
import { LitElement, html, customElement } from "lit-element";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { fetchSleeps } from "./requestSleeps";

@customElement("sleep-widget")
export class SleepWidget extends LitElement {
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
      <div id="hook"></div>
    `;
  }
  firstUpdated() {
    const hookElem = this.shadowRoot
      ? this.shadowRoot.querySelector("#hook")
      : null;
    ReactDOM.render(<SleepReactWidget />, hookElem);
  }
}

const useSleep = () => {
  const [isFirst, setIsFirst] = React.useState(true);
  const [wakeup, setWakeup] = React.useState(0);
  const [length, setLength] = React.useState(0);
  useEffect(() => {
    const id = setTimeout(
      () => {
        // SignIn check
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        // fetch
        (async () => {
          const resSleeps = isSignedIn
            ? await fetchSleeps(gapi)
            : ([[0, 0]] as [number, number][]);
          const lastSleep = resSleeps[resSleeps.length - 1];
          setWakeup(lastSleep[0]);
          setLength(lastSleep[1]);
          setIsFirst(false);
        })();
      },
      isFirst ? 3 * 1000 : 5 * 60 * 1000
    );
    return () => clearTimeout(id);
  });
  return [wakeup, length];
};

const SleepReactWidget: React.FC = props => {
  const [wakeup, length] = useSleep();
  return <SleepIndexes sleepLength={length} wakeup={wakeup} />;
};

interface SleepIndexesProps {
  sleepLength: number;
  wakeup: number;
}

const SleepIndexes: React.FC<SleepIndexesProps> = props => {
  const url =
    "https://docs.google.com/spreadsheets/d/1tPqJlHvR7pu3q4idv2zyYC435eHPVsL7Vn0Q1YCgvt0";
  const sLength = Duration.fromObject({
    hours: 0,
    minutes: 0,
    milliseconds: props.sleepLength
  }).normalize();

  const wakeup = dt.fromMillis(props.wakeup).toLocaleString(dt.TIME_24_SIMPLE);
  const lengthHours = sLength.hours;
  const lengthMinutes = sLength.minutes;
  const isGoodWakeup = lengthHours > 5; // fake
  return (
    <SleepIcon
      wakeup={wakeup}
      lengthHours={lengthHours}
      lengthMinutes={lengthMinutes}
      isGoodWakeUp={isGoodWakeup}
    />
  );
};

interface SleepIconProps {
  wakeup: string;
  lengthHours: number;
  lengthMinutes: number;
  isGoodWakeUp: boolean;
}
const SleepIcon: React.FC<SleepIconProps> = props => {
  const url =
    "https://docs.google.com/spreadsheets/d/1tPqJlHvR7pu3q4idv2zyYC435eHPVsL7Vn0Q1YCgvt0";
  return (
    <>
      <a href={url} target="_blank" rel="noopener">
        <i
          className={`material-icons md-48 md-dark ${
            props.isGoodWakeUp ? "md-inactive" : ""
          }`}
        >
          airline_seat_recline_normal
        </i>
        <h3>
          {props.wakeup} ({props.lengthHours}h {props.lengthMinutes}m)
        </h3>
      </a>
    </>
  );
};
