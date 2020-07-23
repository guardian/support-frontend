// @flow

import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography';
import { neutral } from '@guardian/src-foundations/palette';

export const componentFooter = css`
  ${textSans.small()};
  font-weight: 400;
  color: ${neutral[100]};
  a {
    color: ${neutral[100]};
  text-decoration: underline;
    :hover, :visited {
      text-decoration: underline;
      color: ${neutral[100]};
    }
  }
`;

export const copyright = css`
  font-size: 12px;
`;
