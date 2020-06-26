import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { brand, brandAlt } from '@guardian/src-foundations/palette';
import { headline, body } from '@guardian/src-foundations/typography';

export const campaignHeader = css`
  display: flex;
  align-items: center;
`;

export const campaignCopy = css`
  display: none;
  position: relative;
  z-index: 10;
  margin-top: ${space[2]}px;

  ${from.phablet} {
    margin-top: 2rem;
    font-size: 35px;
    line-height: 1;
    display: block;
    padding-left: ${space[1]}px;
  }

  ${from.tablet} {
    padding-left: 0;
  }

  ${from.desktop} {
    margin-top: 3rem;
  }

  ${from.leftCol} {
    margin-top: 5rem;
  }
`;

export const heading = css`
  ${headline.small()};
  font-weight: bold;
  color: ${brand[400]};
  margin-bottom: ${space[3]}px;

  ${from.desktop} {
    ${headline.medium()};
    font-weight: bold;
  }

  ${from.leftCol} {
    ${headline.large()};
    font-weight: bold;
  }
`;

export const subheading = css`
  ${headline.xxxsmall()};
  font-weight: bold;

  ${from.phablet} {
    max-width: 80%;
  }

  ${from.desktop} {
    ${headline.xsmall()};
    font-weight: bold;
  }

  ${from.leftCol} {
    max-width: 100%;
  }
`;

export const graphicOuter = css`
  display: flex;
  justify-content: flex-start;
  margin-top: -0.8rem;

  ${from.phablet} {
    justify-content: flex-end;
    margin-top: -9.7rem;
  }

  ${from.desktop} {
    margin-top: -14rem;
  }

  ${from.leftCol} {
    margin-top: -15rem;
  }
`;

export const graphicInner = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const graphic = css`
  line-height: 0 !important;

  img {
    max-height: 170px;

    ${from.phablet} {
      max-height: 150px;
    }

    ${from.desktop} {
      max-height: 200px;
    }

    ${from.leftCol} {
      max-height: 230px;
    }
  }
`;

export const badge = css`
  position: relative;
  margin-bottom: -2rem;
  z-index: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${brandAlt[400]};
  color: ${brand[400]};
  text-align: center;
  border-radius: 50%;
  ${body.small()};
  font-weight: bold;
  width: 7.5rem;
  height: 7.5rem;
  padding-top: ${space[1]}px;

  ${from.mobileMedium} {
    margin-bottom: -3rem;
  }

  ${from.desktop} {
    justify-content: flex-end;
    ${headline.xxsmall()};
    font-weight: bold;
    width: 10rem;
    height: 10rem;
    padding-bottom: ${space[6]}px;
    margin-left: -3rem;
  }

  ${from.leftCol} {
    width: 12rem;
    height: 12rem;
    padding-bottom: ${space[9]}px;
  }

  span {
    display: block;
  }

  span:first-of-type {
    margin-bottom: 0.3rem;
  }

  span:nth-child(2) {
    ${headline.large()}
    font-weight: bold;
    line-height: 65%;
    position: relative;
    margin-bottom: 0.2rem;

    ${from.desktop} {
      ${headline.xlarge()}
      line-height: 75%;
      font-weight: bold;
      font-size: 3rem;
      margin-bottom: 0.2rem;
    }

    ${from.leftCol} {
      font-size: 4rem;
      margin-bottom: 0.4rem;
    }
  }
`;

