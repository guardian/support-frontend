// @flow

import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography/obj';
import { border } from '@guardian/src-foundations/palette';

export const list = css`
  overflow: auto;
  max-height: 350px;
  box-sizing: border-box;
  position: absolute;
  z-index: 999;
  background: white;
  width: 100%;
  border: solid 1px ${border.secondary};
`;

export const listItem = (selected: boolean) => css`
  padding: 0px 4px;
  background: ${selected ? '#eee' : '#fff'};
  ${textSans.small()}
  .highlight {
    font-weight: bold;
  }
`;
