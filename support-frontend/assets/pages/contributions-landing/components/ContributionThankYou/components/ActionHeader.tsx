import * as React from "react";
import { css } from "@emotion/core";
import { body } from "@guardian/src-foundations/typography";
import { from } from "@guardian/src-foundations/mq";
const text = css`
  ${body.medium({
  fontWeight: 'bold'
})};

  ${from.desktop} {
    font-size: 20px;
  }
`;
type ActionHeaderProps = {
  title: string;
};

const ActionHeader = ({
  title
}: ActionHeaderProps) => <header>
    <h1 css={text}>{title}</h1>
  </header>;

export default ActionHeader;