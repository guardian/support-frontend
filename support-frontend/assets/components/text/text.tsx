import type { ReactNode } from 'react';
import type { HeadingSize } from 'components/heading/heading';
import Heading from 'components/heading/heading';
import {
	largeParagraphStyle,
	sansParagraphStyle,
	textContainer,
	titleHeading,
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
		<div css={textContainer}>
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
		<Heading size={size} cssOverrides={titleHeading}>
			{children}
		</Heading>
	);
}
export function LargeParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p css={largeParagraphStyle}>{children}</p>;
}
export function SansParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p css={sansParagraphStyle}>{children}</p>;
}
