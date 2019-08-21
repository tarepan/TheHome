import { html, render } from "lit-html";
const date_gene = date => html`
  <section id="clock">
    <h2>${date.toLocaleString()}</h2>
  </section>
`;
const rendering = () =>
  render(date_gene(new Date()), document.body.querySelector("#for_lit"));
rendering();
window.setInterval(rendering, 1 * 1000);
