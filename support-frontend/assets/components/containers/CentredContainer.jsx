// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';

type PropTypes = {|
  cssOverrides?: string;
  children: Node;
|}

const centredContainer = css`
  position: relative;
  width: 100%;
  margin: 0 auto;
  max-width: 1290px;
`;

function CentredContainer(props: PropTypes) {
  return (
    <div css={[centredContainer, props.cssOverrides]}>
      {props.children}
    </div>
  );
}

CentredContainer.defaultProps = {
  cssOverrides: '',
};

export default CentredContainer;
