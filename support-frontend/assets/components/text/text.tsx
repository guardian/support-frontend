import type { ReactNode } from 'react';
import type { HeadingSize } from 'components/heading/heading';
import Heading from 'components/heading/heading';
import {
	component_text,
	component_text__heading,
	component_text__large,
	component_text__sans,
} from './textStyles';

type TextProps = {
	title?: string | null;
	className?: string | null;
	headingSize?: HeadingSize;
	children?: ReactNode | null;
};
export default function Text({
	title = null,
	headingSize = 2,
	children = null,
}: TextProps): JSX.Element {
	return (
		<div css={[component_text, !children ? component_text__heading : null]}>
			{title && <Title size={headingSize}>{title}</Title>}
			{children}
		</div>
	);
}

export function Title({
	children,
	size,
}: {
	children: ReactNode;
	size: HeadingSize;
}): JSX.Element {
	return (
		<Heading size={size} cssOverrides={component_text__heading}>
			{children}
		</Heading>
	);
}
export function LargeParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p css={component_text__large}>{children}</p>;
}
export function SansParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p css={component_text__sans}>{children}</p>;
}
