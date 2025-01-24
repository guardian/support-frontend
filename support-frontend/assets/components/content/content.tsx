// ----- Imports ----- //
import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import 'helpers/types/option';
import './content.scss';

// ---- Types ----- //
const Appearances = {
	white: 'white',
	grey: 'grey',
	highlight: 'highlight',
	feature: 'feature',
	dark: 'dark',
};

export type Appearance = keyof typeof Appearances;

type PropTypes = {
	appearance: Appearance;
	id?: string;
	children: ReactNode;
	image: ReactNode | null;
	modifierClasses: string[];
	innerBackground?: string | null;
	needsHigherZindex: boolean;
	border: boolean | null;
};

// ----- Render ----- //
function Content({
	appearance,
	children,
	id,
	modifierClasses,
	innerBackground,
	image,
	needsHigherZindex,
	border,
}: PropTypes): JSX.Element {
	return (
		<div
			id={id}
			className={classNameWithModifiers('component-content', [
				appearance,
				image ? 'overflow-hidden' : null,
				needsHigherZindex ? 'higher' : null,
				border === false ? 'no-border' : null,
				border === true ? 'force-border' : null,
				...modifierClasses,
			])}
		>
			<LeftMarginSection>
				<div
					className={
						innerBackground
							? `component-content__content--${innerBackground}`
							: 'component-content__content'
					}
				>
					{children}
					{image && <div className="component-content__image">{image}</div>}
				</div>
			</LeftMarginSection>
		</div>
	);
}

Content.defaultProps = {
	appearance: 'white',
	id: null,
	image: null,
	modifierClasses: [],
	innerBackground: null,
	needsHigherZindex: false,
	border: null,
};

// ---- Children ----- //
/*
Adds a multiline divider between block children.
*/
export function Divider({ small }: { small: boolean }): JSX.Element {
	return (
		<div
			className={classNameWithModifiers('component-content__divider', [
				small ? 'small' : null,
			])}
		>
			<hr className="component-content__divider__line" />
		</div>
	);
}
Divider.defaultProps = {
	small: false,
};

/*
Cancels out the horizontal padding
Wrap full bleed children in this.
*/
export function Outset({ children }: { children: ReactNode }): JSX.Element {
	return <div className="component-content__outset">{children}</div>;
}

/*
A vertical block with max width
*/
export function NarrowContent({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	return <div className="component-content__narrowContent">{children}</div>;
}

export default Content;
