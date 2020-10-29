// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

type PropTypes = {|
  children: Node;
|};

const block = css`
  margin: ${space[6]}px 0;
  border: 1px solid ${neutral[86]};
  background-color: ${neutral[100]};
  padding: ${space[12]}px;
`;

function Block(props: PropTypes) {
  return (
    <div css={block}>
      {props.children}
    </div>
  );
}

export default Block;
