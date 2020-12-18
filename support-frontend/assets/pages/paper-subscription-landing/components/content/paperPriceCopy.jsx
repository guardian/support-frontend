// @flow

import React from 'react';
import { css } from '@emotion/core';

type PropTypes = {|
  saving: string,
  copy: string,
|};

const savingStyle = css`
  display: block;
  font-weight: 700;
`;

function PaperPriceCopy({ saving, copy }: PropTypes) {
  return (
    <span>
      {saving && <span css={savingStyle}>{saving}</span>}
      {copy}
    </span>
  );
}

export default PaperPriceCopy;
