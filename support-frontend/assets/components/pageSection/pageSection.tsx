// ----- Imports ----- //
import React from 'react';
import type { Node } from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './pageSection.scss';
// ----- Props ----- //
type PropTypes = {
	modifierClass?: string;
	heading?: string;
	headingChildren?: Node;
	children?: Node;
};

// ----- Component ----- //
function PageSection(props: PropTypes) {
	return (
		<section
			className={classNameWithModifiers('component-page-section', [
				props.modifierClass,
			])}
		>
			<div className="component-page-section__content">
				<div className="component-page-section__header">
					<Heading heading={props.heading} />
					{props.headingChildren}
				</div>
				<div className="component-page-section__body">{props.children}</div>
			</div>
		</section>
	);
}

// ----- Auxiliary Components ----- //
function Heading(props: { heading: string | null | undefined }) {
	if (props.heading) {
		return <h2 className="component-page-section__heading">{props.heading}</h2>;
	}

	return null;
}

// ----- Default Props ----- //
PageSection.defaultProps = {
	modifierClass: '',
	heading: '',
	headingChildren: null,
	children: null,
}; // ----- Exports ----- //

export default PageSection;
