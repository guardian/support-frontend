// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

type PropTypes = {|
  children: Node;
|};

const block = css`
  position: relative;
  margin: ${space[6]}px 0;
  border: 1px solid ${neutral[86]};
  background-color: ${neutral[100]};
  padding: ${space[12]}px;
  z-index: 2;
`;

function Block(props: PropTypes) {
  return (
    <div css={block}>
      {props.children}
    </div>
  );
}

export default Block;
