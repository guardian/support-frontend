// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { neutral } from '@guardian/src-foundations/palette';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { type Option } from 'helpers/types/option';

// ---- Types ----- //

type PropTypes = {|
  id?: Option<string>,
  children: Node,
|};

const container = css`
  border: ${neutral[86]} 1px solid;
  border-top: none;
  width: 100%;
  padding: 0 ${space[3]}px;
`;


// ----- Render ----- //

const Content = ({
  children, id,
}: PropTypes) => (
  <div
    id={id}
  >
    <LeftMarginSection>
      <div css={container}>{children}</div>
    </LeftMarginSection>
  </div>

);

Content.defaultProps = {
  id: null,
};

export default Content;
