import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
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
