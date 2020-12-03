import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';

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
  margin: 10px 10px 0 0;
  z-index: 10;

  ${from.tablet} {
    margin: 0 0 0;
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
  }
`;
