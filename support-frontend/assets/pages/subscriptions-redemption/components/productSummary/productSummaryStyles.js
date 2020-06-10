import { css } from '@emotion/core';
import { body, headline, textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { background, border, brandAltBackground, neutral, text } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';

export const wrapper = css`
  background-color: ${background.primary};
  color: ${text.primary};
  ${until.desktop} {
    padding: ${space[3]}px;
  }
  ${until.tablet} {
    box-shadow: 0px 4px 4px ${border.secondary};
  }
`;

export const contentBlock = css`
  display: flex;
  width: 100%;

  ${from.tablet} {
    display: block;
  }
`;

export const imageContainer = css`
  display: inline-flex;
  align-items: flex-start;
  width: calc(100%-30px);
  padding: 15px 10px 0 15px;
  background-color: ${neutral['97']};

  img {
    width: 100%;
    height: auto;

  }

  ${until.tablet} {
    width: 65px;
    height: 73px;
    padding-top: 8px;
    padding-left: 8px;
    overflow: hidden;
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

export const endSummary = css`
  display: none;

  ${from.desktop} {
    display: block;
  }
`;


export const list = css`
  ${from.desktop} {
    color: ${text.primary};
    width: calc(100%-${space[3]}px * 2);
    margin: ${space[3]}px;
    padding-top: ${space[3]}px;
    border-top: 1px solid ${border.secondary};
  }

  li {
    margin-bottom: ${space[4]}px;
  }
`;

export const listMain = css`
  ${textSans.medium({ fontWeight: 'bold' })};
  margin-left: ${space[3]}px;
  display: inline-block;
  max-width: 90%;
`;

export const subText = css`
  display: block;
  ${textSans.small()};
  margin-left: ${space[5]}px;
  line-height: 135%;
`;

export const dot = css`
  display: inline-block;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background-color: ${background.ctaPrimary};
  vertical-align: top;
  margin-top: ${space[2]}px;
`;

