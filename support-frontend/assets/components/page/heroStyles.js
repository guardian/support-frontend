// @flow

import { css } from '@emotion/core';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { headline, body } from '@guardian/src-foundations/typography';
import { breakpoints } from '@guardian/src-foundations';

const roundelSizeMob = 120;

export const hero = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${neutral[100]};
  border: none;
  padding-top: ${space[3]}px;
  background-color: ${brand[400]};
  width: 100%;

  ${from.tablet} {
    flex-direction: row;
  }

  /* Typography defaults */
  ${body.small()};

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
  }
  /* TODO: fix this when we port over the image components */
  .component-grid-picture {
    display: flex;
  }
`;

// Keep the content below the roundel on mobile if present
export const roundelOffset = css`
  ${until.tablet} {
    margin-top: ${(roundelSizeMob / 2) - space[6]}px;
  }
`;

export const heroImage = css`
  align-self: flex-end;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;

  ${from.tablet} {
    width: 40%;
  }

  & img {
    max-width: 100%;
  }
`;

export const heroRoundelContainer = css`
  position: absolute;
  top: 0;
  right: ${space[3]}px;

  ${from.tablet} {
  right: ${space[12]}px;
  }
`;

export const heroRoundel = css`
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  text-align: center;
  transform: translateY(-67%);
  min-width: ${roundelSizeMob}px;
  min-height: ${roundelSizeMob}px;
  padding: ${space[1]}px;
  border-radius: 50%;
  background-color: ${brandAlt[400]};
  color: ${neutral[7]};
  ${headline.xxsmall({ fontWeight: 'bold' })};
  z-index: 20;

  ${from.tablet} {
    transform: translateY(-50%);
    ${headline.small({ fontWeight: 'bold' })};
  }

  ${from.leftCol} {
    padding: ${space[3]}px;
  }

  /* Combined with float on the main element, this makes the height match the content width for a perfect circle
  cf. https://medium.com/@kz228747/height-equals-width-pure-css-1c79794e470c */
  &::before {
    content: "";
    margin-top: 100%;
  }
`;

export const roundelNudgeUp = css`
  ${until.tablet} {
    transform: translateY(-67%);
  }
`;

export const roundelNudgeDown = css`
  ${until.tablet} {
    transform: translateY(-34%);
  }
`;

export const roundelHidingPoints: { [key: string]: string } = Object.keys(breakpoints)
  .reduce((hidingPoints, breakpoint) => {
  // eslint-disable-next-line no-param-reassign
    hidingPoints[breakpoint] = css`
      ${until[breakpoint]} {
        display: none;
      }
    `;
    return hidingPoints;
  }, {});
