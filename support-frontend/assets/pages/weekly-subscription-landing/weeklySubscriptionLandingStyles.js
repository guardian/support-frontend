// @flow

import { css } from '@emotion/core';
import { brand, neutral, brandText, brandAlt, brandBackground } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const pricesSection = css`
  padding-top: ${space[24]}px;
  transform: translateY(-84px);
  background-color: ${brand[300]};
  color: ${neutral[100]};
`;
