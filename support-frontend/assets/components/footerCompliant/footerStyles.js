// @flow

import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import { brand, neutral, brandText, brandAlt } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const componentFooter = css`
  background-color: ${brand[400]};
  ${textSans.small()};
  font-weight: 400;
  color: ${neutral[100]};
  a {
    color: ${brandText.anchorPrimary};
    :hover {
      text-decoration: underline;
      color: ${brandAlt[400]};
    }
  }
`;

export const copyright = css`
  font-size: 12px;
  ${until.tablet} {
    padding-top: ${space[3]}px;
  }
`;

export const linksList = css`
  width: 100%;
  list-style: none;
  columns: 2;
  column-rule: 1px solid ${brand[600]};
  column-gap: ${space[12]}px;

  ${from.tablet} {
    columns: none;
    column-gap: 0;
    display: flex;
  }
`;

export const link = css`
  padding: ${space[2]}px ${space[1]}px;

  & a {
    text-decoration: none;
  }

  ${until.tablet} {
    &:nth-of-type(2n) {
      padding-bottom: ${space[9]}px;
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
  background-color: ${brand[400]};
  position: absolute;
  padding: ${space[1]}px;
  right: ${space[2]}px;
  top: 0;
  transform: translateY(-50%);

  & a:hover {
    text-decoration: none;
  }
`;
