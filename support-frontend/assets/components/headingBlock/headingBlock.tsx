// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import './headingBlock.scss';

// ----- Types ----- //
type PropTypes = {
	overheading: Option<string> | ReactNode;
	children?: ReactNode;
	orderIsAGift?: boolean;
	overheadingClass?: string;
};

// ----- Component ----- //
function HeadingBlock(props: PropTypes): JSX.Element {
	const giftOrder = props.orderIsAGift ? '__gift' : '';
	const overheadingClass = props.overheadingClass ? props.overheadingClass : '';
	return (
		<div className={`component-heading-block${giftOrder}`}>
			<div className="component-heading-block__content">
				{props.overheading ? (
					[
						<h1
							className={`component-heading-block__overheading${overheadingClass}`}
						>
							{props.overheading}
						</h1>,
						<div className="component-heading-block__heading">
							<h2 className="component-heading-block__fontSize">
								{props.children}
							</h2>
						</div>,
					]
				) : (
					<div className="component-heading-block__heading">
						<h1 className="component-heading-block__fontSize">
							{props.children}
						</h1>
					</div>
				)}
			</div>
		</div>
	);
}

HeadingBlock.defaultProps = {
	children: null,
	overheading: null,
	orderIsAGift: false,
	overheadingClass: '',
}; // ----- Export ----- //

export default HeadingBlock;
