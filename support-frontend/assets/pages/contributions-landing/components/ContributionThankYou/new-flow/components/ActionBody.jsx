// @flow
import * as React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';

const bodyContainer = css`
  * {
    ${body.small()};

    ${from.desktop} {
      font-size: 17px;
    }
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
