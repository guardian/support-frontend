import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { background, brandAltBackground, brand, text, border, neutral } from '@guardian/src-foundations/palette';
import { from, between, until } from '@guardian/src-foundations/mq';

export const wrapper = css`
  background-color: ${background.primary};
  color: ${text.primary};
  ${until.desktop} {
    padding: ${space[3]}px;
  }
  ${until.tablet} {
    box-shadow: 0 4px 4px ${border.secondary};
  }
`;

export const topLine = css`
  width: calc(100%-${space[3]}px * 2);
  padding: 0 ${space[3]}px;

  ${until.desktop} {
    border-top: 1px solid ${neutral['93']};
    padding: ${space[1]}px 0 ${space[2]}px;
  }


  a, a:visited {
    display: block;
    ${textSans.small()};
    color: ${text.primary};
    ${from.desktop} {
      ${textSans.medium({ fontWeight: 'bold' })};
    }
  }

  ${between.phablet.and.desktop} {
    display: block;
  }
`;

export const topLineBorder = css`
  padding: ${space[3]}px 0;
  border-bottom: 1px solid ${neutral[86]};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const title = css`
  ${headline.xsmall({ fontWeight: 'bold' })}
`;

export const contentBlock = css`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${neutral[60]};

  ${from.tablet} {
    display: block;
  }
`;

export const imageContainer = css`
  display: inline-flex;
  align-items: flex-start;
  padding: ${space[9]}px 0;
  background-color: ${neutral[100]};

  img {
    width: 100%;
    height: auto;
  }

  ${until.tablet} {
    padding: 0;
    width: 75px;
    height: 45px;
    overflow: hidden;
    img {
      align-items: flex-end;
    }
  }
`;

export const textBlock = css`
  margin-left: ${space[3]}px;

  ${from.desktop} {
    display: flex;
    justify-content: space-between;
    width: calc(100%-${space[3]}px * 2);
    margin: ${space[3]}px;
    align-items: baseline;
  }

  h3 {
    ${body.medium({ fontWeight: 'bold' })};
    margin: -5px 0 -3px;
    ${from.desktop} {
      ${headline.xxsmall({ fontWeight: 'bold' })};
      margin-top: 0;
    }
  }
  p, span {
    max-width: 240px;
  }
  span {
    background-color: ${brandAltBackground.primary};
    padding: 2px;
    ${textSans.small({ fontWeight: 'bold' })};
    ${from.desktop} {
      padding: ${space[1]}px;
      ${textSans.medium()};
    }
  }
  p {
    ${body.small({ fontWeight: 'normal' })};
    line-height: 135%;
    ${from.desktop} {
      display: none;
    }
  }
`;

export const products = css`
  display: none;

  ${from.desktop} {
    display: block;
  }
`;

export const infoContainer = css`
  padding: 0 ${space[2]}px;
`;

export const info = css`
  ${textSans.xsmall()};
  line-height: 22px;
  display: flex;
  padding: ${space[2]}px 0;
  border-top: 1px solid ${neutral[86]};

  svg {
    max-width: 22px;
    fill: ${brand[400]};
    margin-right: ${space[2]}px;
  }
`;

export const total = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  background-color: ${neutral[97]};
  padding: ${space[2]}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
