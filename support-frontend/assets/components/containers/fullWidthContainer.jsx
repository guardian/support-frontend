// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';

type PropTypes = {|
  cssOverrides?: string;
  children: Node;
|}

const fullWidthContainer = css`
  background-color: ${neutral[93]};
  width: 100%;
  display: flex;
`;

function FullWidthContainer(props: PropTypes) {
  return (
    <div css={[
      fullWidthContainer,
      props.cssOverrides,
    ]}
    >
      {props.children}
    </div>
  );
}

FullWidthContainer.defaultProps = {
  cssOverrides: '',
};

export default FullWidthContainer;
