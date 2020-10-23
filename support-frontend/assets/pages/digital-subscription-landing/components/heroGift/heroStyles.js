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
  padding-top: ${space[4]}px;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 170px;
    background: ${brand[300]};
    content: '';
  }

  ${from.mobileLandscape} {
    :before {
      height: 200px;
    }
  }

  ${from.desktop} {
    :before {
      height:200px;
    }
  }
`;

export const pageTitle = css`
  ${headline.large({ fontWeight: 'bold' })};
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: 0 ${space[3]}px ${space[9]}px;

  ${from.mobileLandscape} {
    padding-bottom: ${space[12]}px;
  }

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    ${titlepiece.large()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: 0 ${space[4]}px ${space[12]}px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const featureContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  background-color: #006D67;
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
    padding: ${space[4]}px 0;
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

export const toYou = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 1px solid white; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.01em; /* Adjust as needed */
  animation:
    typing-to 0.7s steps(3, end),
    blink-caret 0.7s step-end infinite;
  animation-fill-mode: both;
  animation-delay: 1s;

  @keyframes typing-to {
    from { width: 0 }
    to { width: 16% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: white; }
  }

  color: ${brandAltBackground.primary};
  ${headline.small({ fontWeight: 'bold' })};

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-left: 8px;
  }
`;

export const FromMe = css`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 1px solid white; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.01em; /* Adjust as needed */
  animation:
    typing 0.5s steps(2, end),
    blink-caret 0.7s step-end infinite;
  animation-fill-mode: both;
  animation-delay: 2.4s;
  color: ${brandAltBackground.primary};

  @keyframes typing {
    from { width: 0 }
    to { width: 13% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: white; }
  }

  ${headline.small({ fontWeight: 'bold' })};

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-left: 8px;
  }

`;

export const heroHeading = css`
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
  font-weight: 600;
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
