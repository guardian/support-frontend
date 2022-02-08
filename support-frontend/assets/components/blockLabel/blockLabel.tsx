import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral, text } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography';
import React from 'react';
import type { ReactNode } from 'react';

const blockLabel = css`
	display: inline-block;
	padding: ${space[1]}px ${space[2]}px;
	${headline.xxxsmall({
		fontWeight: 'bold',
	})};
	background-color: ${neutral[0]};
	color: ${text.ctaPrimary};
	margin-left: -1px;

	${from.tablet} {
		${headline.xxsmall({
			fontWeight: 'bold',
		})};
	}

	${from.desktop} {
		${headline.xsmall({
			fontWeight: 'bold',
		})};
	}
`;
type BlockLabelPropTypes = {
	children: ReactNode;
	tag?: keyof JSX.IntrinsicElements;
	cssOverrides?: string | string[];
};

function BlockLabel({
	children,
	tag = 'div',
	cssOverrides,
}: BlockLabelPropTypes): JSX.Element {
	const TagName = tag;
	return <TagName css={[blockLabel, cssOverrides]}>{children}</TagName>;
}

BlockLabel.defaultProps = {
	tag: 'div',
	cssOverrides: '',
};
export default BlockLabel;
