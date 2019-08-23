import { html, render, TemplateResult } from "lit-html";

const dateGene = (date: Date): TemplateResult => html`
  <section id="clock">
    <h2>${date.toLocaleString()}</h2>
  </section>
`;
const rendering = (): void =>
  render(dateGene(new Date()), document.body.querySelector(
    "#for_lit"
  ) as Element);
rendering();
window.setInterval(rendering, 1 * 1000);
