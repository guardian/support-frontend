import type { ReactNode } from 'react';
import type { HeadingSize } from 'components/heading/heading';
import Heading from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './text.scss';

type TextProps = {
	title?: string | null;
	className?: string | null;
	headingSize?: HeadingSize;
	children?: ReactNode | null;
};
export default function Text({
	title = null,
	className = null,
	headingSize = 2,
	children = null,
}: TextProps): JSX.Element {
	return (
		<div
			className={[
				className,
				classNameWithModifiers('component-text', [
					!children ? 'heading-only' : null,
				]),
			].join(' ')}
		>
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
		<Heading size={size} className="component-text__heading">
			{children}
		</Heading>
	);
}
export function LargeParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p className="component-text__large">{children}</p>;
}
export function SansParagraph({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <p className="component-text__sans">{children}</p>;
}
