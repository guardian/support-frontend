
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';

const hideAfterDesktop = css`
  display: block;

  ${from.desktop} {
    display: none;
  }
`;

const hideBeforeDesktop = css`
  display: none;

  ${from.desktop} {
    display: block;
  }
`;

export default { hideAfterDesktop, hideBeforeDesktop };
