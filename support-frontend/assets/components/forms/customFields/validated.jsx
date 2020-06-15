// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';

import { type Option } from 'helpers/types/option';
import { InlineSuccess } from '@guardian/src-user-feedback';

// ----- Types ----- //
export type PropsForHoc = {
  valid: Option<string>,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children?: Option<Node>,
};

const mainCss = css`
  .component-input:not([type-radio]) {
    border-color: #22874D;
  }
`;

// ----- Component ----- //

function Validated({
  valid,
  htmlFor,
  children,
}: Props) {
  const Element = htmlFor ? 'label' : 'div';

  return (
    <div css={mainCss}>
      <Element
        aria-hidden={!valid}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-valid__valid"
      >
        {valid && <InlineSuccess>{valid}</InlineSuccess>}
      </Element>
      {children}
    </div>
  );
}

// ----- Exports ----- //

export { Validated };
