import React from "react";
import { css } from "@emotion/core";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
import { ErrorSummary } from "components/subscriptionCheckouts/submitFormErrorSummary";
const maxWidth = css`
  max-width: 360px;
`;
const stories = storiesOf('Errors', module).addDecorator(withKnobs).addDecorator(withCenterAlignment);
stories.add('Error summary', () => <div css={maxWidth}>
    <ErrorSummary errors={[{
    message: 'Please enter a valid account name'
  }, {
    message: 'Please enter a valid sort code'
  }, {
    message: 'Please enter a valid account number'
  }, {
    message: 'Please confirm you are the account holder'
  }]} />
  </div>);