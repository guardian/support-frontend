// @flow
import * as React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';

const bodyContainer = css`
  * {
    ${body.small()};
  }
`;

type ActionBodyProps = {|
  children: React.Node;
|};

const ActionBody = ({ children }: ActionBodyProps) => (
  <div css={bodyContainer}>
    {children}
  </div>
);

export default ActionBody;
