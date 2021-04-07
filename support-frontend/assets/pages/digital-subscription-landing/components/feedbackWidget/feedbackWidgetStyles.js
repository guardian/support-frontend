// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';
import { success, background, text } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { textSans } from '@guardian/src-foundations/typography';

// ----- Constants ----- //

export const wrapper = css`
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 100%;

  ${from.desktop} {
    width: 100px;
  }
`;

export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${textSans.small({ fontWeight: 'bold' })};
  color: ${background.primary};
  background: ${background.ctaPrimary};
  padding: ${space[3]}px;
  border-radius: 3px 3px 0 0;
`;

export const clickedCss = css`
  background: ${success[400]};
  border-radius: 50%;
`;

export const buttonStyles = css`
  border: ${background.primary} solid 2px;
  border-radius: 50%;
  :first-of-type {
    margin-right: ${space[3]}px;
  }
  svg {
    display: block;
    padding: ${space[1]}px;
  }
`;

export const feedbackLink = css`
  background: ${background.primary};
  color: ${text.primary};
  ${textSans.small()};
  padding: ${space[3]}px;
  p {
    margin-bottom: ${space[2]}px;
  }
`;
