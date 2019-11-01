import React from "react";
//@ts-ignore
import InlineSVG from "svg-inline-react";

interface WeightIconProps {
  weightLatest: number;
  deltaWeekly: number;
  deltaWPercent: number;
}

export const WeightIcon: React.FC<WeightIconProps> = props => {
  const url =
    "https://docs.google.com/spreadsheets/d/1iLT4X-1FCByjLxG1jwQVuBJnit5BP9LYe99vxyg9Rh8";
  const svgSource = `
    <svg viewBox="0 0 520 520" width="100" height="100">
      <g>
        <path
          class="st0"
          style="fill:#4B4B4B; fill: rgb(75, 75, 75);"
          d="M455.998,0.004H56.002C25.063,0.011,0.008,25.067,0,56.006v399.989c0.008,30.938,25.063,55.994,56.002,56.002h399.997c30.938-0.008,55.994-25.063,56.002-56.002V56.006C511.993,25.067,486.937,0.011,455.998,0.004z M479.999,455.994c-0.007,6.68-2.664,12.579-7.032,16.969c-4.39,4.367-10.289,7.024-16.969,7.032H56.002c-6.68-0.008-12.579-2.664-16.969-7.032c-4.367-4.39-7.023-10.289-7.031-16.969V56.006c0.008-6.68,2.664-12.579,7.031-16.977c4.39-4.359,10.289-7.016,16.969-7.023h399.997c6.68,0.007,12.579,2.664,16.969,7.023c4.367,4.398,7.024,10.297,7.032,16.977V455.994z"
        ></path>
        <path
          class="st0"
          style="fill:#4B4B4B; fill: rgb(75, 75, 75);"
          d="M128.012,119.101l26.391,76.783H270.86l16.352-67.947l9.938,2.031l9.93,2.015l-10.696,63.9h61.212l26.392-76.783C346.612,96.577,302.83,83.6,256.008,83.6C209.178,83.6,165.388,96.577,128.012,119.101z"
        ></path>

        <text x="50" y="350" font-size="160">${props.weightLatest.toFixed(
          1
        )}</text>
        <text x="370" y="350" font-size="80">kg</text>

        <text x="60" y="450" font-size="80">
          ${props.deltaWeekly.toFixed(1)}
        </text>
        <text x="200" y="450" font-size="40">
          kg
        </text>

        <text x="285" y="450" font-size="80">
          ${props.deltaWPercent.toFixed(1)}
        </text>
        <text x="430" y="450" font-size="40">
          %
        </text>
      </g>
    </svg>
  `;
  return (
    <a href={url} target="_blank">
      <InlineSVG src={svgSource} element="div" />
    </a>
  );
};
