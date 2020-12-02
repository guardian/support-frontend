// @flow

import { css } from '@emotion/core';
import { brand, neutral } from '@guardian/src-foundations/palette';

export const pricesSection = css`
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
