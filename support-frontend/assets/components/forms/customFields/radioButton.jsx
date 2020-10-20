// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { border } from '@guardian/src-foundations/palette';
import { Radio } from '@guardian/src-radio';
import { Button } from '@guardian/src-button';

type RadioButtonPropTypes = {
  label: string,
  value: string,
  name: string,
  checked: boolean,
  onClick: Function,
  onChange: Function,
}

const radioButtonStyles = css`
  margin-bottom: ${space[2]}px;
  width: 80%;
  border: 2px solid ${border.primary};
`;

const RadioButton = (props: RadioButtonPropTypes) => (
  <Button onClick={props.onClick} priority="tertiary" css={radioButtonStyles}>
    <Radio {...props} />
  </Button>
);

export default RadioButton;
