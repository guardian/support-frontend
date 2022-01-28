// ----- Imports ----- //
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import React from 'react';
import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import 'helpers/types/option';

// ---- Types ----- //
type PropTypes = {
	id?: string | undefined;
	children: ReactNode;
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
function Content({ children, id, divider }: PropTypes): JSX.Element {
	return (
		<div id={id}>
			<LeftMarginSection>
				<div css={container}>
					{divider && <Divider />}
					<div css={contentContainer}>{children}</div>
				</div>
			</LeftMarginSection>
		</div>
	);
}

Content.defaultProps = {
	id: null,
	divider: false,
};

function Divider() {
	return (
		<div css={dividerContainer}>
			<hr css={dividerLine} />
		</div>
	);
}

export default Content;
