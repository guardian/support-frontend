// ----- Imports ----- //
import type { ReactNode } from 'react';
import type { HeadingSize } from 'components/heading/heading';
import Heading from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './text.scss';

// ---- Types ----- //
type PropTypes = {
	title?: string | null;
	className: string | null | undefined;
	children?: ReactNode | null | undefined;
	headingSize: HeadingSize;
};

// ----- Render ----- //
function Text({
	title,
	children,
	headingSize,
	className,
}: PropTypes): JSX.Element {
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

Text.defaultProps = {
	headingSize: 2,
	children: null,
	title: null,
	className: null,
};
// ----- Children ----- //
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

// ----- Exports ----- //
export default Text;
