import { svg, SVGTemplateResult } from "lit-element";

export function mealIcon(
  count: number,
  calory: number,
  active: boolean
): SVGTemplateResult {
  const opacity = active ? 1 : 0.38;
  return svg`
    <svg height="48" viewBox="0 0 62 24">
        <g>
            <path opacity=${opacity} d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/>
            <text opacity=${opacity} x="34" y="12" font-size="8">${count}</text><text opacity=${opacity} x="46" y="12" font-size="6">times</text>
            <text opacity=${opacity} x="25" y="23" font-size="10">${calory}</text><text opacity=${opacity} x="50" y="23" font-size="6">kcal</text>
        </g>
    </svg>
  `;
}
