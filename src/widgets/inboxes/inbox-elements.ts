import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

/**
 * Dev Notes: Dependency Injection throught <slot>
 */
@customElement("inbox-widget")
export class InboxWidget extends LitElement {
  @property({ type: Number }) inboxCount = 0;
  constructor() {
    super();
    setInterval(this.checkInboxes.bind(this), 1000);
  }
  private checkInboxes(): void {
    // // ES next: with Optional chaining
    // const count = this.shadowRoot
    //   ?.querySelector("#slots")
    //   ?.querySelector("slot")
    //   ?.assignedElements()
    //   ?.reduce(
    //     // @ts-ignore
    //     (total, node) => (total + node.inboxCount ? node.inboxCount : 0),
    //     0
    //   )
    this.inboxCount = pipe(
      O.fromNullable(this.shadowRoot),
      O.chain(rt => O.fromNullable(rt.querySelector("#slots"))),
      O.chain(div => O.fromNullable(div.querySelector("slot"))),
      O.chain(slot => O.fromNullable(slot.assignedElements())),
      O.map(assigneds =>
        assigneds.reduce(
          // @ts-ignore
          (total, node) => (total + node.inboxCount ? node.inboxCount : 0),
          0
        )
      ),
      O.getOrElse(() => 10000)
    );
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
      <div>
        <details>
          <summary>
            <h2>inbox: ${this.inboxCount}</h2>
          </summary>
          <div id="slots">
            <slot name="widget"><p>No widget</p></slot>
          </div>
        </details>
      </div>
    `;
  }
}
