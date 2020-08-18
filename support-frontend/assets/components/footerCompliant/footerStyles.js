// @flow

import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import { brand, neutral, brandText, brandAlt, brandBackground } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const componentFooter = css`
  &, & *, & *:before, & *:after {
    box-sizing: border-box;
  }

  background-color: ${brandBackground.primary};
  ${textSans.small()};
  font-weight: 400;
  color: ${neutral[100]};

  /* TODO: Check if we can remove this; depends on styles applied to the legal text passed in
    Preferably switch to the Link component in Source for all links- current display property means we can't use it as of 2.0 */
  a {
    font-size: inherit;
    color: ${brandText.anchorPrimary};
    :hover {
      text-decoration: underline;
      color: ${brandAlt[400]};
    }
  }
`;

export const copyright = css`
  font-size: ${textSans.xsmall()};
  ${until.tablet} {
    padding-top: 28px;
  }
`;

export const linksList = css`
  width: 100%;
  list-style: none;
  display: grid;
  grid-column-gap: ${space[5]}px;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  grid-auto-flow: column;
  padding-bottom: ${space[1]}px;

  ${from.tablet} {
    display: flex;
    grid-column-gap: 0;
  }

  a {
    line-height: 19px;
  }
`;

export const link = css`
  padding: ${space[2]}px ${space[1]}px;

  ${until.tablet} {
    /* Select only the first two elements
    https://css-tricks.com/useful-nth-child-recipies/#select-only-the-first-five */
    &:nth-of-type(-n+2) {
      padding-right: ${space[5]}px;
      border-right: 1px solid ${brand[600]};
    }
  }

  ${from.tablet} {
    padding: ${space[2]}px ${space[5]}px ${space[4]}px;
    min-width: ${space[24]}px;

    &:first-of-type {
      padding-left: 0;
    }

    &:not(:last-child) {
      border-right: 1px solid ${brand[600]};
    }
  }
`;

export const backToTopLink = css`
  background-color: ${brandBackground.primary};
  position: absolute;
  padding: 0 ${space[1]}px;
  right: ${space[2]}px;
  top: 0;
  transform: translateY(-50%);

  & a:hover {
    text-decoration: none;
  }
`;

export const footerTextHeading = css`
  ${textSans.small({ fontWeight: 'bold' })};
`;
