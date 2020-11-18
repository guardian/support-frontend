import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { body } from '@guardian/src-foundations/typography';

import { brandAlt } from '@guardian/src-foundations/palette';

export const paymentSelection = css`
  display: flex;
  flex-wrap: wrap;

  ${from.phablet} {
    justify-content: left;
  }

  ${from.tablet} {
    margin-top: 0;
    padding-left: 0;
  }

  ${from.leftCol} {
    padding-left: 0;
  }
`;

export const paymentSelectionCard = css`
  position: relative;
  width: 100%;
  max-width: 32.5rem;
  display: flex;
  margin: 10px;
  z-index: 10;

  ${from.tablet} {
    margin: 0;
    max-width: 30rem;
    width: 320px;
  }

  :last-of-type {
    margin: 30px 10px 20px 0;

    ${from.mobileLandscape} {
      margin-left: 10px;
    }

    ${from.tablet} {
      margin: 0 0 0 20px;
    }

    ${from.leftCol} {
      margin-left: 40px;
    }

    ${from.wide} {
      margin-left: 50px;
    }
  }
`;

export const productOptionLabel = css`
  position: absolute;
  top: -24px;
  ${body.medium({ fontWeight: 'bold' })};
  padding: 0 ${space[4]}px;
  background-color: ${brandAlt[400]};
  color: ${neutral[7]};
  border-radius: 0 3px 3px 3px;
  z-index: 0;
`;

