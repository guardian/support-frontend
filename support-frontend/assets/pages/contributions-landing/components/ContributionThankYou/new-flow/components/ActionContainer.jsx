// @flow
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';

const container = css`
  background: white;
  padding-top: ${space[2]}px;
  padding-bottom: ${space[5]}px;
  border-top: 1px solid ${neutral[86]};
  border-bottom: 1px solid ${neutral[86]};

  ${from.desktop} {
    padding-left: ${space[4]}px;
    padding-right: 72px;
    border: 1px solid ${neutral[86]};
  }
`;

type ActionContainerProps = {|
  children: React.ReacElement
|};

const ActionContainer: React.FC<ActionContainerProps> = ({
  children,
}: ActionContainerProps) => <section css={container}>{children}</section>;

export default ActionContainer;
