// ----- Imports ----- //
import type { ReactNode } from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './leftMarginSection.scss';

// ----- Props ----- //
type PropTypes = {
	modifierClasses: Array<string | null | undefined>;
	className: string | null | undefined;
	children: ReactNode;
};

// ----- Component ----- //
export default function LeftMarginSection(props: PropTypes): JSX.Element {
	return (
		<section
			className={[
				props.className,
				classNameWithModifiers(
					'component-left-margin-section',
					props.modifierClasses,
				),
			].join(' ')}
		>
			<div className="component-left-margin-section__content">
				{props.children}
			</div>
		</section>
	);
} // ----- Default Props ----- //

LeftMarginSection.defaultProps = {
	modifierClasses: [],
	className: null,
};
