import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { background, brandAltBackground, text } from '@guardian/src-foundations/palette';
import { from, between, until } from '@guardian/src-foundations/mq';

export const wrapper = css`
  background-color: ${background.primary};
  color: ${text.primary};
  padding-bottom: ${space[3]}px;
`;

export const topLine = css`
  display: flex;
  justify-content: space-between;
  width: calc(100%-${space[3]}px * 2);
  margin: ${space[3]}px;
  align-items: center;

  a, a:visited {
    display: block;
    ${textSans.small()};
    color: ${text.primary};
  }

  ${between.phablet.and.desktop} {
    display: block;
  }
`;

export const sansTitle = css`
  ${textSans.medium({ fontWeight: 'bold' })};
  ${from.phablet} {
    ${textSans.large({ fontWeight: 'bold' })};
  }
`;

export const contentBlock = css`
  display: flex;
  width: 100%;
  margin-bottom: ${space[3]}px;

  ${from.tablet} {
    display: block;
  }
`;

export const imageContainer = css`
  display: inline-flex;
  width: calc(100%-30px);
  height: auto;
  padding: 15px 10px 0 15px;
  background-color: #63717A;

  img {
    width: 100%;
    align-items: flex-end;
  }

  ${until.tablet} {
    width: 65px;
    height: 73px;
    padding-top: 8px;
    padding-left: 8px;
    overflow: hidden;
    margin-left: ${space[3]}px;
    img {
      width: 200%;
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
    ${headline.xxsmall({ fontWeight: 'bold' })};
    align-items: flex-start;
  }
  p, span {
    max-width: 240px;
    ${until.desktop} {
      margin-bottom: ${space[2]}px;
    }
  }
  span {
    background-color: ${brandAltBackground.primary};
    padding: ${space[1]}px;
    ${body.medium()};
  }
  p {
    ${headline.xxsmall({ fontWeight: 'normal' })};
    line-height: 135%;
    ${from.desktop} {
      display: none;
    }
  }
`;
