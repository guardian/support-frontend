import { css } from '@emotion/core';
import { textSans } from '@guardian/src-foundations/typography/obj';

export const formDiv = css`
  position: relative;
`;

export const editButton = css`
  ${textSans.medium({ 'font-weight': '600' })};
  text-decoration: underline;
  font-size: 100%;
  text-align: left;
  background: none;
  margin-top: 6px;
  padding: 0;
  border: none;
  cursor: pointer;
  width: 100%;
`;
