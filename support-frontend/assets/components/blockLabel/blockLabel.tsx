import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { headline } from "@guardian/src-foundations/typography";
import { neutral, text } from "@guardian/src-foundations/palette";
import { from } from "@guardian/src-foundations/mq";
const blockLabel = css`
  display: inline-block;
  padding: ${space[1]}px ${space[2]}px;
  ${headline.xxxsmall({
  fontWeight: 'bold'
})};
  background-color: ${neutral[0]};
  color: ${text.ctaPrimary};
  margin-left: -1px;

  ${from.tablet} {
    ${headline.xxsmall({
  fontWeight: 'bold'
})};
  }

  ${from.desktop} {
    ${headline.xsmall({
  fontWeight: 'bold'
})};
  }
`;
type PropTypes = {
  children: Node;
  tag?: string;
  cssOverrides?: string | string[];
};

function BlockLabel({
  children,
  tag = 'div',
  cssOverrides
}: PropTypes) {
  const TagName = tag;
  return <TagName css={[blockLabel, cssOverrides]}>
      {children}
    </TagName>;
}

BlockLabel.defaultProps = {
  tag: 'div',
  cssOverrides: ''
};
export default BlockLabel;