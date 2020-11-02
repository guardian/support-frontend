// @flow

import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { brand, neutral } from '@guardian/src-foundations/palette';

export const pricesSection = css`
  :before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    transform: translateY(-100%);
    height: 88px;
    width: 100%;
    background-color: ${brand[300]};
  }
  position: relative;
  background-color: ${brand[300]};
  color: ${neutral[100]};
`;

export const giftOrPersonalSection = css`
  background-color: ${neutral[100]};
  color: ${neutral[7]};
`;

export const paddedSection = css`
  padding: ${space[3]}px 0 ${space[12]}px;
`;
