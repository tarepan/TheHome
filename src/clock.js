import { html, render } from "lit-html";
const dateGene = date => html`
  <section id="clock">
    <h2>${date.toLocaleString()}</h2>
  </section>
`;
const rendering = () =>
  render(dateGene(new Date()), document.body.querySelector("#for_lit"));
rendering();
window.setInterval(rendering, 1 * 1000);
