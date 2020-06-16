// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';

import { type Option } from 'helpers/types/option';
import { InlineSuccess } from '@guardian/src-user-feedback';
import { success } from '@guardian/src-foundations';

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
    border-color: ${success['400']};
  }
  .component-input:not([type-radio]):focus {
    outline: 4px solid ${success['400']};
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
    <div css={valid ? mainCss : null}>
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
