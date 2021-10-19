import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { from } from "@guardian/src-foundations/mq";
type PropTypes = {
  cssOverrides?: string;
  children: Node;
};
const flexContainer = css`
  display: flex;
  flex-direction: column;
  ${from.tablet} {
    flex-direction: row;
  }
`;

function FlexContainer(props: PropTypes) {
  return <div css={[flexContainer, props.cssOverrides]}>
      {props.children}
    </div>;
}

FlexContainer.defaultProps = {
  cssOverrides: ''
};
export default FlexContainer;