import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	display: block;
	overflow: hidden;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;

	:not(:last-child) {
		margin-bottom: ${space[3]}px;

		${from.mobileLandscape} {
			margin-bottom: ${space[4]}px;
		}
	}
`;

export interface BoxProps extends CSSOverridable {
	children: React.ReactNode;
	tag?: keyof JSX.IntrinsicElements;
	onClick?: () => void;
}

export function Box(props: BoxProps): JSX.Element {
	const TagName = props.tag ?? 'section';
	return (
		<TagName
			css={[mainStyles, props.cssOverrides ?? '']}
			onClick={props.onClick}
		>
			{props.children}
		</TagName>
	);
}

const innerContainerStyles = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[5]}px;
	}

	${from.desktop} {
		padding: ${space[6]}px;
	}
`;

export function BoxContents(props: BoxProps): JSX.Element {
	const TagName = props.tag ?? 'div';
	return (
		<TagName css={[innerContainerStyles, props.cssOverrides ?? '']}>
			{props.children}
		</TagName>
	);
}
