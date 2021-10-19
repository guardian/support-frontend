// ----- Imports ----- //
import type { Node } from 'react';
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
// ---- Types ----- //
type PropTypes = {
	id?: Option<string>;
	children: Node;
	divider?: boolean;
};
const container = css`
	border: ${neutral[86]} 1px solid;
	border-bottom: none;
	width: 100%;
`;
const contentContainer = css`
	width: 100%;
	padding: 0 ${space[2]}px ${space[6]}px;
	${from.desktop} {
		padding: 0 ${space[5]}px ${space[9]}px;
	}
`;
const dividerLine = css`
  background-image: repeating-linear-gradient(to bottom,
    ${neutral[86]},
    ${neutral[86]} 0.0625rem,
    transparent 0.0625rem,
    transparent 0.25rem);
  margin-block-start: 0;
  margin-block-end: 0;
  height: 20px;
  border-width: 0;
  background-repeat: repeat-x;
  background-position: bottom;
  background-size: 0.0625rem 0.8125rem;
  height: 0.8125rem;
  border-left: border: ${neutral[86]} 1px solid;
`;
const dividerContainer = css`
  border-left: border: ${neutral[86]} 1px solid;
  margin-right: 0.25px;
`;

// ----- Render ----- //
const Content = ({ children, id, divider }: PropTypes) => (
	<div id={id}>
		<LeftMarginSection>
			<div css={container}>
				{divider && <Divider />}
				<div css={contentContainer}>{children}</div>
			</div>
		</LeftMarginSection>
	</div>
);

Content.defaultProps = {
	id: null,
	divider: false,
};

const Divider = () => (
	<div css={dividerContainer}>
		<hr css={dividerLine} />
	</div>
);

export default Content;
