import { LitElement, html, customElement, TemplateResult } from "lit-element";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

@customElement("health-hub")
export class HealthHub extends LitElement {
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
    ReactDOM.render(
      <HealthHubReact>
        <h4>hello, healthHub</h4>
        <TestReact />
      </HealthHubReact>,
      hookElem
    );
  }
}

const HealthHubReact: React.FC = props => {
  const [notifMap, setNotif] = React.useState(new Map<string, boolean>());
  const updateNotification: (name: string, state: boolean) => void = (
    name,
    isNotif
  ) => {
    setNotif(notifMap => new Map(notifMap.set(name, isNotif)));
    console.log("call setNotif");
  };

  const children = React.Children.map(props.children, child => {
    switch (typeof child) {
      case "object":
        console.log("assign setNotification");
        // @ts-ignore
        return React.cloneElement(child, {
          setNotification: updateNotification
        });
      default:
        return child;
    }
  });

  return (
    <>
      <details>
        <summary>
          <i
            className={`material-icons md-48 md-dark ${
              Array.from(notifMap.values()).every(isNotif => !isNotif)
                ? "md-inactive"
                : ""
            }`}
          >
            info
          </i>

          <h3>HealthHome</h3>
        </summary>
        {children}
      </details>
    </>
  );
};

interface NotifProps {
  setNotification?: (name: string, isNotif: boolean) => void;
}
const TestReact: React.FC<NotifProps> = props => {
  const [state, setState] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => {
      setState(i => i + 1);
      const isNotif = state > 5;
      console.log(`isNotif: ${isNotif ? "notif" : "no"}`);
      props.setNotification
        ? props.setNotification("testReact", isNotif)
        : undefined;
    }, 1000);
    return () => clearTimeout(id);
  });
  return (
    <>
      <h3>{state < 5 ? "under 5" : "Big!!"}</h3>
    </>
  );
};
