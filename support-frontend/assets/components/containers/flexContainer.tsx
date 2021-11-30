import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import type { ReactNode } from 'react';
import React from 'react';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

type PropTypes = {
	children: ReactNode;
} & CSSOverridable;

const flexContainer = css`
	display: flex;
	flex-direction: column;
	${from.tablet} {
		flex-direction: row;
	}
`;

function FlexContainer(props: PropTypes): JSX.Element {
	return <div css={[flexContainer, props.cssOverrides]}>{props.children}</div>;
}

FlexContainer.defaultProps = {
	cssOverrides: '',
};
export default FlexContainer;
