import * as React from "react";
import { headline } from "@guardian/src-foundations/typography";
import { space } from "@guardian/src-foundations";
import { from } from "@guardian/src-foundations/mq";
import { css } from "@emotion/core";
type ContributionAmountLabelProps = {
  children: React.ReactNode;
};
const container = css`
  margin-bottom: ${space[3]}px;
  ${headline.xxxsmall()}
  font-weight: bold;

  ${from.desktop} {
    font-size: 20px;
  }
`;

const ContributionAmountRecurringNotification = ({
  children
}: ContributionAmountLabelProps) => <div css={container}>
    {children}
  </div>;

export default ContributionAmountRecurringNotification;