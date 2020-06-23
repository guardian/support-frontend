import { css } from '@emotion/core';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography';

export const campaignHeader = css`
  display: flex;
  align-items: center;
`;

export const campaignCopy = css`
  display: none;
  position: relative;
  z-index: 10;
  margin-top: ${space[2]}px;

  ${from.leftCol} {
    margin-top: 5rem;
  }

  ${from.phablet} {
    font-size: 35px;
    line-height: 1;
    display: block;
    padding-left: ${space[1]}px;

    h2 {
      ${headline.large({ fontWeight: 'bold' })};
      color: ${brand[400]};
      margin-bottom: ${space[3]}px;

      span:first-of-type {
        position: relative;
        z-index: 5;
      }
      span:nth-of-type(2) {
        ${until.leftCol} {
          display: block;
          width: 400px;
        }

        ${until.desktop} {
          width: 300px;
        }
      }
    }

    p {
      ${headline.xsmall({ fontWeight: 'bold' })};
    }
  }

  ${from.tablet} {
    padding-left: 0;
  }
`;

export const graphicOuter = css`
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  ${from.phablet} {
    justify-content: flex-end;
    margin-top: -11rem;
  }

  ${from.desktop} {
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
    max-height: 180px;

    ${from.leftCol} {
      max-height: 230px;
    }
  }
`;


export const badge = css`
  position: relative;
  margin-bottom: -3rem;
  margin-left: -3.5rem;
  z-index: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: ${brandAlt[400]};
  color: ${brand[400]};
  text-align: center;
  border-radius: 50%;
  line-height: 1;
  ${headline.xxsmall({ fontWeight: 'bold' })};
  width: 6rem;
  height: 6rem;

  ${from.desktop} {
    ${headline.small({ fontWeight: 'bold' })};
    width: 12rem;
    height: 12rem;
    padding-bottom: ${space[6]}px;
  }

  span {
    display: block;
    line-height: 1;
  }

  span:nth-child(2) {
    ${headline.small()}
    position: relative;
    font-variant-numeric: lining-nums;
    -moz-font-feature-settings: "lnum";
    -webkit-font-feature-settings: "lnum";
    font-feature-settings: "lnum";

    ${from.desktop} {
      ${headline.xlarge()};
      font-size: 4rem;
      top: 0.3rem;
    }
  }


`;
