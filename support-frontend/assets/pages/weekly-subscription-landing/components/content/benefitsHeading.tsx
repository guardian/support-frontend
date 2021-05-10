import React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { headline } from "@guardian/src-foundations/typography";
const heading = css`
  ${headline.xsmall({
  fontWeight: 'bold'
})}
  overflow-wrap: break-word;
  margin-bottom: ${space[3]}px;
`;
type PropTypes = {
  text: string;
};

function BenefitsHeading(props: PropTypes) {
  return <h2 css={heading}>{props.text}</h2>;
}

export default BenefitsHeading;