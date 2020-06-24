import { css } from '@emotion/core';
import { from, until } from '@guardian/src-foundations/mq';
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
  }

  ${from.desktop} {
    margin-top: 3rem;
  }

  ${from.leftCol} {
    margin-top: 5rem;
  }

  ${from.phablet} {
    font-size: 35px;
    line-height: 1;
    display: block;
    padding-left: ${space[1]}px;
  }

  ${from.tablet} {
    padding-left: 0;
  }
`;

export const heading = css`
  ${headline.small({ fontWeight: 'bold' })};
  color: ${brand[400]};
  margin-bottom: ${space[3]}px;

  ${from.desktop} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.leftCol} {
    ${headline.large({ fontWeight: 'bold' })};
  }
`;

export const headingLineOne = css`
  position: relative;
  z-index: 5;
`;

export const headingLineTwo = css`
  ${until.leftCol} {
    display: block;
    width: 400px;
  }

  ${until.desktop} {
    width: 300px;
  }
`;

export const subheading = css`
  ${headline.xxxsmall({ fontWeight: 'bold' })};

  ${from.phablet} {
    max-width: 80%;
  }

  ${from.desktop} {
    ${headline.xsmall({ fontWeight: 'bold' })};
    max-width: 80%;
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
  line-height: 1;
  ${body.small({ fontWeight: 'bold' })};
  width: 7.5rem;
  height: 7.5rem;

  ${from.mobileMedium} {
    margin-bottom: -3rem;
  }

  ${from.desktop} {
    justify-content: flex-end;
    ${headline.xxsmall({ fontWeight: 'bold' })};
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
    line-height: 0.5;
  }

  span:first-of-type {
    margin-bottom: ${space[2]}px;

    ${from.leftCol} {
      margin-bottom: 0;
    }
  }

  span:nth-child(2) {
    ${headline.large({ fontWeight: 'bold' })}
    position: relative;
    font-variant-numeric: lining-nums;
    -moz-font-feature-settings: "lnum";
    -webkit-font-feature-settings: "lnum";
    font-feature-settings: "lnum";
    margin-top: ${space[1]}px;

    ${from.desktop} {
      ${headline.xlarge({ fontWeight: 'bold' })}
      font-size: 3rem;
    }

    ${from.leftCol} {
      font-size: 4rem;
      top: 0.3rem;
    }
  }
`;

