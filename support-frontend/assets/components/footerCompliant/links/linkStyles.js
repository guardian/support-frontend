import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

export const linksList = css`
  list-style: none;
  columns: 2;
  column-rule: 1px solid ${brand[600]};

  ${from.tablet} {
    columns: none;
    display: flex;
  }
`;

export const link = css`
  & a {
    text-decoration: none;
  }

  ${from.tablet} {
    padding: ${space[2]}px ${space[5]}px ${space[4]}px;
    min-width: ${space[24]}px;

    &:first-child {
      padding-left: 0;
    }

    &:not(:last-child) {
      border-right: 1px solid ${brand[600]};
    }
  }
`;
