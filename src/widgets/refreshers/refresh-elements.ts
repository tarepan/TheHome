import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";

/**
 * Widget for automatic browser reload
 */
@customElement("refresh-widget")
export class RefreshWidget extends LitElement {
  @property({ type: Number }) intervalMin = 120;
  private refresherID?: number;
  constructor() {
    super();
    this.setRefresh();
  }
  setRefresh(): void {
    // Not setInterval but setTimeout because browser reload clear timeout/interval context.
    this.refresherID = this.refreshReloader(this.intervalMin, this.refresherID);
  }
  /**
   * Refresh browser reloader by canceling old one and set new one
   * @param intervalMin - new interval/timeout until browser reload
   * @param oldID - previously set timeoutID which is going to be canceled
   */
  private refreshReloader(intervalMin: number, oldID?: number): number {
    clearTimeout(oldID); // clearTimeout accept undefined which results in nothing without exeption
    return setTimeout(() => location.reload(), intervalMin * 60 * 1000, false);
  }
  render(): TemplateResult {
    this.setRefresh();
    return html``;
  }
}
