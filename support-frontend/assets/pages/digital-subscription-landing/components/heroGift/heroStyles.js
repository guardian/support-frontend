// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';

import { headline, titlepiece, body } from '@guardian/src-foundations/typography';
import { brand, neutral } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { digitalSubscriptionsBlue } from 'stylesheets/emotion/colours';

export const wrapper = css`
  position: relative;
  background: ${neutral[93]};
  display: flex;
  flex-direction: column;
  padding: 0 0 ${space[3]}px;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: ${digitalSubscriptionsBlue};
    content: '';
  }

  ${from.mobileLandscape} {
    :before {
      height: 200px;
    }
  }

  ${from.tablet} {
    :before {
      top: -1px;
    }
  }
`;

export const pageTitle = css`
  ${headline.medium({ fontWeight: 'bold' })};
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: ${space[3]}px;
  align-self: center;

  ${from.mobileLandscape} {
    ${headline.large({ fontWeight: 'bold' })};
  }

  ${from.phablet} {
    width: 100%;
    padding: ${space[5]}px ${space[3]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
    align-self: center;
  }

  ${from.desktop} {
    ${titlepiece.medium()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: ${space[5]}px ${space[4]}px;
  }

  ${from.leftCol} {
    ${titlepiece.large()}
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const featureContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  background-color: ${brand[300]};
  color: ${neutral[97]};
  padding: ${space[3]}px;
  padding-bottom: 0;
  width: 100%;

  ${from.tablet} {
    display: inline-flex;
    flex-direction: row;
    width: 100%;
    align-self: center;
    padding: 0 ${space[4]}px ${space[4]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    justify-content: space-between;
    max-width: calc(100% - 110px);
    max-width: 1100px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
    padding-bottom: 0;
  }
`;

export const textSection = css`
  width: 100%;

  ${from.tablet} {
    padding: ${space[1]}px 0;
    width: 55%;
  }

  ${from.leftCol} {
    width: 40%;
    padding-bottom: 40px;
  }
`;

export const heroHeading = css`
  display: inline-flex;
  ${headline.small({ fontWeight: 'bold' })};
  max-width: 100%;
  letter-spacing: .01em;

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
  }

  ${from.leftCol} {
    margin-top: 0;
  }
`;

export const paragraph = css`
  ${body.small()};
  max-width: 100%;
  margin: ${space[5]}px 0;

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.tablet} {
    ${body.medium()};
    max-width: 90%;
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
    max-width: 87%;
    margin-top: 20px;
  }

  ${from.leftCol} {
    max-width: 100%;
    margin-top: ${space[12]}px;
  }
`;

export const heavyText = css`
  font-weight: bold;
`;

export const packShot = css`
  display: block;
  width: 100%;
  margin-top: ${space[5]}px;
  margin-bottom: -6px;

  img {
    width: 100%;
  }

  ${from.tablet} {
    position: absolute;
    bottom: -6px;
    right: 5px;
    margin: 0;
    max-width: 50%;
  }

  ${from.desktop} {
    right: 0;
    max-width: 45%;
    margin-bottom: 0;
  }

  ${from.leftCol} {
    max-width: 500px;
  }

  ${from.wide} {
    right: 20px;
  }
`;
