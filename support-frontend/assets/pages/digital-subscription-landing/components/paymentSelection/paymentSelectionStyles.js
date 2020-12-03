import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
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

export const productOverride = css`
  &:not(:first-of-type) {
    margin-top: ${space[4]}px;
  }
  ${from.tablet} {
    &:not(:first-of-type) {
      margin-top: 0;
    }
    &:not(:last-of-type) {
      margin-right: ${space[5]}px;
    }
  }
`;

export const productOverrideWithLabel = css`
  &:not(:first-of-type) {
    margin-top: ${space[12]}px;
  }
  ${from.tablet} {
    &:not(:first-of-type) {
      margin-top: 0;
    }
    &:not(:last-of-type) {
      margin-right: ${space[5]}px;
    }
  }
`;

