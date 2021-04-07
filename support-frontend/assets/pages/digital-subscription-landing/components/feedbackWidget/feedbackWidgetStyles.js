// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';
import { neutral, success } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

// ----- Constants ----- //

export const wrapper = css`
  position: fixed;
  background: ${neutral[93]};
  padding-top: ${space[3]}px;
  z-index: 10; 
  bottom: 0;
  right: 0;
  width: 100px;
  border: 3px solid #73AD21;

`;

export const clickedCss = css`
  background: ${success[400]};

`;
