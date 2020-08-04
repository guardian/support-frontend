// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

type PropTypes = {|
  className: string,
  centred?: boolean,
  paddingTop?: boolean,
  border?: boolean,
  children: Node,
|}

const paddingStyle = css`
  padding-top: ${space[4]}px;
`;

const borderStyle = css`
  ${from.tablet} {
    border-left: 1px solid ${brand[600]}; border-right: 1px solid ${brand[600]};
  }
`;

const borderStyleCentred = css`
  ${from.wide} {
    border-left: 1px solid ${brand[600]}; border-right: 1px solid ${brand[600]};
  }
`;

const contentStyle = css`
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-basis: ${space[24] * 10}px;
  padding: 0 ${space[5]}px;
  padding-bottom: ${space[4]}px;
  border-bottom: 1px solid ${brand[600]};
`;

export function Content({
  className, centred, border, paddingTop, children,
}: PropTypes) {
  let borderStylesToApply = '';
  if (border && centred) {
    borderStylesToApply = borderStyleCentred;
  } else if (border) {
    borderStylesToApply = borderStyle;
  }
  return (
    <div
      className={className}
      css={[
      contentStyle,
      paddingTop ? paddingStyle : '',
      borderStylesToApply,
    ]}
    >
      {children}
    </div>
  );
}

Content.defaultProps = {
  centred: false,
  border: false,
  paddingTop: false,
};
