// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';

import { headline, titlepiece, body } from '@guardian/src-foundations/typography';
import { brand, neutral, brandAltBackground } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const wrapper = css`
  position: relative;
  background: #ededed;
  display: flex;
  flex-direction: column;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: #006D67;
    content: '';
  }

  ${from.mobileLandscape} {
    :before {
      height: 200px;
    }
  }

  ${from.tablet} {
    :before {
      top: -1px;
    }
  }
`;

export const pageTitle = css`
  ${headline.medium({ fontWeight: 'bold' })};
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: ${space[3]}px;
  align-self: center;

  ${from.mobileLandscape} {
    ${headline.large({ fontWeight: 'bold' })};
  }

  ${from.phablet} {
    width: 100%;
    padding: ${space[5]}px ${space[3]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    ${titlepiece.medium()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: ${space[4]}px ${space[4]}px ${space[6]}px;
  }

  ${from.leftCol} {
    ${titlepiece.large()}
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const featureContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  background-color: ${brand[300]};
  color: ${neutral[97]};
  padding: ${space[3]}px;
  padding-bottom: 0;
  width: 100%;

  ${from.tablet} {
    display: inline-flex;
    flex-direction: row;
    width: 100%;
    align-self: center;
    padding: 0 ${space[4]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    justify-content: space-between;
    max-width: calc(100% - 110px);
    max-width: 1100px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const textSection = css`
  width: 100%;

  ${from.tablet} {
    padding: ${space[1]}px 0;
    width: 55%;
  }

  ${from.leftCol} {
    width: 40%;
    padding-bottom: 60px;
  }
`;

export const giftTag = css`
  display: flex;
  flex-direction:column;
`;

export const toFromLines = css`
  display: inline-flex;
  justify-content: flex-start;
`;

export const toYouTyping = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  white-space: nowrap; /* Keeps the content on a single line */
  letter-spacing: 0.01em; /* Adjust as needed */
  margin-left: ${space[2]}px;
  animation:
    typing-to 0.7s steps(3, end);

  /* This is to make it work on iPhones */
  -webkit-animation-name: typing-to;
  -webkit-animation-duration: 0.7s;
  -webkit-animation-timing-function: steps(3, end);

  @keyframes typing-to {
    from { width: 0 }
    to { width: 17.5% }
  }

  @-webkit-keyframes typing-to {
    from { width: 0 }
    to { width: 17.5% }
  }

  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  animation-delay: 1s;
  -webkit-animation-delay: 1s;

  @media (prefers-reduced-motion) {
    animation: none;
    -webkit-animation: none;
    border-right: none;
    -webkit-border-right: none;
  }

  @keyframes typing-to {
    from { width: 0 }
    to { width: 17.5% }
  }

  color: ${brandAltBackground.primary};
  ${headline.small({ fontWeight: 'bold' })};

  ${from.mobileMedium} {
    @keyframes typing-to {
      from { width: 0 }
      to { width: 15% }
    }
  }

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
    @keyframes typing-to {
      from { width: 0 }
      to { width: 14% }
    }
  }

  ${from.phablet} {
    @keyframes typing-to {
      from { width: 0 }
      to { width: 10% }
    }
  }

  ${from.tablet} {
    @keyframes typing-to {
      from { width: 0 }
      to { width: 17% }
    }
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-left: 8px;
    @keyframes typing-to {
      from { width: 0 }
      to { width: 16% }
    }
  }

  ${from.leftCol} {
    @keyframes typing-to {
      from { width: 0 }
      to { width: 18.5% }
    }
  }

  ${from.wide} {
    @keyframes typing-to {
      from { width: 0 }
      to { width: 16.5% }
    }
  }
`;

export const toYouCursor = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 1px solid white; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  animation:
    blink-caret-to 0.7s steps(3, jump-both);

  /* This is to make it work on iPhones */
  -webkit-animation-name: blink-caret-to;
  -webkit-animation-duration: 0.7s;
  -webkit-animation-timing-function: steps(3, jump-both);
  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  animation-delay: 1s;
  -webkit-animation-delay: 1s;

  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  animation-delay: 1s;
  -webkit-animation-delay: 1s;

  @media (prefers-reduced-motion) {
    animation: none;
    -webkit-animation: none;
    border-right: none;
    -webkit-border-right: none;
  }

  @keyframes blink-caret-to {
    from, to { border-color: transparent }
    50% { border-color: white; }
  }
`;

export const fromMeTyping = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  white-space: nowrap; /* Keeps the content on a single line */
  letter-spacing: 0.01em; /* Adjust as needed */
  margin-left: ${space[2]}px;
  animation:
    typing-from 0.5s steps(2, end);

  /* This is to make it work on iPhones */
  -webkit-animation-name: typing-from;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-timing-function: steps(2, end);

  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  animation-delay: 2.4s;
  -webkit-animation-delay: 2.4s;

  color: ${brandAltBackground.primary};

  @media (prefers-reduced-motion) {
    animation: none;
    border-right: none;
  }

  @keyframes typing-from {
    from { width: 0 }
    to { width: 14% }
  }

  @-webkit-keyframes typing-from {
    from { width: 0 }
    to { width: 14% }
  }

  ${headline.small({ fontWeight: 'bold' })};

  ${from.mobileMedium} {
    @keyframes typing-from {
      from { width: 0 }
      to { width: 10% }
    }
  }

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
    @keyframes typing-from {
      from { width: 0 }
      to { width: 8% }
    }
  }

  ${from.phablet} {
    @keyframes typing-from {
      from { width: 0 }
      to { width: 8% }
    }
  }

  ${from.tablet} {
    @keyframes typing-from {
      from { width: 0 }
      to { width: 14% }
    }
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-left: 8px;
    @keyframes typing-from {
      from { width: 0 }
      to { width: 13% }
    }
  }

  ${from.leftCol} {
    @keyframes typing-from {
      from { width: 0 }
      to { width: 15.5% }
    }
  }

  ${from.wide} {
    @keyframes typing-from {
      from { width: 0 }
      to { width: 13.25% }
    }
  }

`;

export const fromMeCursor = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 1px solid white; /* The typwriter cursor */
  animation:
    blink-caret-from 0.7s steps(2, jump-end);

  /* This is to make it work on iPhones */
  -webkit-animation-name: blink-caret-from;
  -webkit-animation-duration: 0.7s;
  -webkit-animation-timing-function: steps(2, jump-end);

  animation-fill-mode: both;
  -webkit-animation-fill-mode: both;
  animation-delay: 2.4s;
  -webkit-animation-delay: 2.4s;

  @media (prefers-reduced-motion) {
    animation: none;
    border-right: none;
  }

  @keyframes typing-from {
    from { width: 0 }
    to { width: 14% }
  }

  @keyframes blink-caret-from {
    from, to { border-color: transparent }
    50% { border-color: white; }
  }

`;

export const heroHeading = css`
  display: inline-flex;
  ${headline.small({ fontWeight: 'bold' })};
  max-width: 100%;
  letter-spacing: .01em;

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
  }

  ${from.leftCol} {
    margin-top: 0;
  }
`;

export const paragraph = css`
  ${body.small()};
  max-width: 100%;
  margin: ${space[5]}px 0;

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.tablet} {
    ${body.medium()};
    max-width: 90%;
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
    max-width: 95%;
    margin-top: 20px;
  }

  ${from.leftCol} {
    max-width: 95%;
    margin-top: ${space[12]}px;
  }
`;

export const heavyText = css`
  font-weight: bold;
`;

export const packShot = css`
  display: block;
  width: 100%;
  margin-top: ${space[5]}px;
  margin-bottom: -5px;

  img {
    width: 100%;
  }

  ${from.tablet} {
    position: absolute;
    bottom: -5px;
    right: 5px;
    margin: 0;
    max-width: 50%;
  }

  ${from.desktop} {
    right: 0;
    max-width: 45%;
    margin-bottom: 0;
  }

  ${from.leftCol} {
    max-width: 500px;
  }

  ${from.wide} {
    right: 20px;
  }
`;
