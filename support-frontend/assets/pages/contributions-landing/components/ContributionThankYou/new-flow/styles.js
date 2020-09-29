import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from "@guardian/src-foundations";

const buttonsContainer = css`
  margin-top: ${space[6]}px;

  & > * + * {
    margin-left: ${space[3]}px;
  }
`;

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

const hideAfterTablet = css`
  display: block;

  ${from.tablet} {
    display: none;
  }
`;

const hideBeforeTablet = css`
  display: none;

  ${from.tablet} {
    display: block;
  }
`;

export default {
  hideAfterDesktop,
  hideBeforeDesktop,
  hideAfterTablet,
  hideBeforeTablet,
  buttonsContainer,
};
