// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';

import { headline, titlepiece, body } from '@guardian/src-foundations/typography';
import { brand, neutral, brandAlt } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { digitalSubscriptionsBlue } from 'stylesheets/emotion/colours';

export const wrapper = css`
  position: relative;
  background: ${neutral[93]};
  display: flex;
  flex-direction: column;
  padding-top: ${space[3]}px;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 170px;
    background: ${digitalSubscriptionsBlue};
    content: '';
  }

  ${from.mobileLandscape} {
    padding-top: ${space[4]}px;
    :before {
      margin-top: -1px;
      height: 200px;
    }
  }
`;

export const pageTitle = css`
  ${headline.large({ fontWeight: 'bold' })};
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: 0 ${space[3]}px ${space[3]}px;
  width: 100%;

  ${from.mobileLandscape} {
    padding-bottom: ${space[4]}px;
  }

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    ${titlepiece.large()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: ${space[3]}px ${space[4]}px ${space[9]}px;
  }

  ${from.leftCol} {
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
  padding: ${space[2]}px ${space[4]}px 0;
  width: 100%;

  ${from.phablet} {
    display: inline-flex;
    flex-direction: row;
    width: 100%;
    align-self: center;
    padding: 0 ${space[4]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    justify-content: space-between;
    max-width: calc(100% - 110px);
    max-width: 1100px;
    min-height: 365px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const textSection = css`
  width: 100%;

  ${from.phablet} {
    padding: ${space[1]}px 0 ${space[4]}px;
    width: 60%;
  }

  ${from.desktop} {
    width: 55%;
  }
`;

export const heroHeading = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  max-width: 100%;
  margin-bottom: ${space[2]}px;

  ${from.mobileMedium} {
    ${headline.small({ fontWeight: 'bold' })};
  }

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.tablet} {
    white-space: nowrap;
    overflow: visible;
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-bottom: ${space[2]}px;
  }

  ${from.leftCol} {
    margin-top: 0;
    margin-bottom: ${space[2]}px;
  }
`;

export const yellowHeading = css`
  color: ${brandAlt[400]};
`;

export const paragraph = css`
  ${body.small()};
  max-width: 100%;
  margin-bottom: ${space[9]}px;

  /* apply the same margin to paragraphs parsed from markdown from promo codes */
  & p:not(:last-of-type) {
    margin-bottom: ${space[9]}px;
  }

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.phablet} {
    ${body.medium()};
    max-width: 85%;
  }

  ${from.desktop} {
    ${headline.xxsmall()};
    line-height: 135%;
    max-width: 90%;
  }

`;

export const heavyText = css`
  font-weight: 600;
`;

export const packShot = css`
  display: block;
  width: 100%;
  margin-top: ${space[5]}px;
  margin-bottom: -5px;

  img {
    width: 100%;
  }

  ${from.phablet} {
    position: absolute;
    bottom: -5px;
    right: 20px;
    max-width: 40%;
    margin: 0 0 0 -20px;

    img {
      width: 110%;
    }
  }

  ${from.tablet} {
    max-width: 45%;
    margin-left: 0px;
    img {
      width: 100%;
    }
  }

  ${from.desktop} {
    right: 0;
    max-width: 40%;
    margin-bottom: 0;
  }

  ${from.leftCol} {
    max-width: 430px;
  }

  ${from.wide} {
    right: 40px;
  }
`;

export const circle = css`
  display: none;

  ${from.phablet} {
    display: flex;
    flex-direction: column;
    position: absolute;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 50%;
    background-color: ${brandAlt[400]};
    height: 130px;
    width: 130px;
    right: 20px;
    top: -40px;
  }

  ${from.phablet} {
    top: -65px;
  }

  ${from.desktop} {
    top: -70px;
  }
`;

export const circleTextTop = css`
  ${headline.medium({ fontWeight: 'bold' })};
  color: ${brand[300]};
`;

export const circleTextBottom = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  color: ${brand[300]};
`;

export const circleTextGeneric = css`
  ${headline.xxsmall({ fontWeight: 'bold' })};
  color: ${brand[300]};
`;

export const spaceAfter = css`
  ${from.desktop} {
    margin-bottom: 70px;
  }

  ${from.leftCol} {
    margin-bottom: 80px;
  }

`;
