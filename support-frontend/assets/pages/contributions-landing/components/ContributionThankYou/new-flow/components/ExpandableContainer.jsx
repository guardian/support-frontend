// @flow
import * as React from 'react';
import { css } from '@emotion/core';

const expandableContainer = css`
  overflow: hidden;
  transition: max-height 0.1s ease-in-out;
 }
`;

const expandableContainerCollapsed = css`
  ${expandableContainer}
  max-height: 0px;
`;

const expandableContainerExpanded = (maxHeight: Number) => css`
  ${expandableContainer}
  max-height: ${maxHeight}px;
`;

type ExpandableContainerProps = {|
  isExpanded: Boolean,
  maxHeight: Number,
  children: React.Node
|};

const ExpandableContainer = ({
  isExpanded,
  maxHeight,
  children,
}: ExpandableContainerProps) => (
  <div
    css={
      isExpanded ? expandableContainerExpanded(maxHeight) : expandableContainerCollapsed
    }
  >
    {children}
  </div>
);

export default ExpandableContainer;
