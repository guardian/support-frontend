// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import { neutral, text } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';

const blockLabel = css`
  width: max-content;
  padding: ${space[1]}px ${space[2]}px;
  ${headline.xxxsmall({ fontWeight: 'bold' })};
  background-color: ${neutral[0]};
  color: ${text.ctaPrimary};

  ${from.tablet} {
    ${headline.xxsmall({ fontWeight: 'bold' })};
  }
`;

type PropTypes = {|
  children: Node;
  cssOverrides?: string;
|};

function BlockLabel({ children, cssOverrides }: PropTypes) {
  return (
    <div css={[blockLabel, cssOverrides]}>
      {children}
    </div>
  );
}

BlockLabel.defaultProps = {
  cssOverrides: '',
};

export default BlockLabel;
