// @flow

import { css } from '@emotion/core';
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

export const giftHeroSubHeading = css`
  font-weight: 700;
`;
