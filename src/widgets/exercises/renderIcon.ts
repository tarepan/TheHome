import { svg, SVGTemplateResult } from "lit-element";

/**
 *
 */
export const exerciseIcon = (
  latest24Count: number,
  latest24Length: number,
  wasGoodExercise: boolean
): SVGTemplateResult => {
  const opacity = !wasGoodExercise ? 1 : 0.38;
  return svg`
    <svg height="48" viewBox="0 0 62 24">
      <g>
        <path opacity=${opacity} d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
        <text opacity=${opacity} x="27.5" y="11" font-size="8">${latest24Count}</text><text opacity=${opacity} x="35" y="11" font-size="6">times</text>
        <text opacity=${opacity} x="27" y="22" font-size="10">${latest24Length}</text><text opacity=${opacity} x="38" y="22" font-size="6">min</text>
      </g>
    </svg>
  `;
};
