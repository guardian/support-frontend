import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { text, border } from '@guardian/src-foundations/palette';

export const list = css`
  display: none;

  ${from.desktop} {
    color: ${text.primary};
    display: block;
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
`;

export const subText = css`
  display: block;
  ${textSans.medium()};
  margin-left: ${space[5]}px;
  line-height: 135%;
`;

export const dot = css`
  display: inline-block;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background-color: #63717A;
  margin-right: ${space[3]}px;
`;
