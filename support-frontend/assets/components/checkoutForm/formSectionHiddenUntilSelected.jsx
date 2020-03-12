// @flow

// eslint-disable-next-line no-unused-vars
import React, { type Node } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { headline } from '@guardian/src-foundations/typography';
import { border } from '@guardian/src-foundations/palette';
import { type Option } from 'helpers/types/option';
import { space } from '@guardian/src-foundations';

const h2 = css`
    ${headline.xsmall()};
`;

const showFormSection = css`
    border-top: 1px solid ${border.secondary};
    padding: ${space[3]}px;
`;

const hideFormSection = css`
    display: none;
`;

const wrapper = css`
    max-width: 23.75rem;
`;

// Hidden version of form section

type FormSectionHiddenPropTypes = {|
  title: Option<string>,
  children: Node,
  show?: boolean,
  id?: Option<string>,
|};

const FormSectionHiddenUntilSelected = ({
  children, title, show, id,
}: FormSectionHiddenPropTypes) => (
  <div id={id} css={show ? showFormSection : hideFormSection}>
    {show && (
    <div css={wrapper}>
      {title && <h2 css={h2}>{title}</h2>}
      {children}
    </div>)}
  </div>
);

FormSectionHiddenUntilSelected.defaultProps = {
  title: null,
  show: false,
  id: '',
};

export { FormSectionHiddenUntilSelected };
