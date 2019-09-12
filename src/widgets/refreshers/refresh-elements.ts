import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";

@customElement("refresh-widget")
export class RefreshWidget extends LitElement {
  @property({ type: Number }) interval_min = 120;
  refreshed: boolean;
  constructor() {
    super();
    this.refreshed = false;
    setTimeout(this.setRefresh.bind(this), 5000);
  }
  setRefresh(): void {
    setTimeout(() => location.reload(false), this.interval_min * 60 * 1000);
  }
  render(): TemplateResult {
    return html``;
  }
}
