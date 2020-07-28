// @flow

import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import { brand, neutral, brandText, brandAlt } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const componentFooter = css`
  background-color: ${brand[400]};
  ${textSans.small()};
  font-weight: 400;
  color: ${neutral[100]};
  a {
    color: ${brandText.anchorPrimary};
    /* text-decoration: underline; */
    :hover {
      text-decoration: underline;
      color: ${brandAlt[400]};
    }
  }
`;

export const copyright = css`
  font-size: 12px;
`;

export const linksList = css`
  width: 100%;
  list-style: none;
  columns: 2;
  column-rule: 1px solid ${brand[600]};

  ${from.tablet} {
    columns: none;
    display: flex;
  }
`;

export const link = css`
  padding: ${space[2]}px ${space[1]}px;

  & a {
    text-decoration: none;
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
  bottom: 0;
  transform: translateY(50%);

  & a:hover {
    text-decoration: none;
  }
`;
