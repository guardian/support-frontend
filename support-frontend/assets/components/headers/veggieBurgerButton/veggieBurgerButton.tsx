import type { Node } from 'react';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import './veggieBurgerButton.scss';

type PropTypes = {
	children: Node;
	label: string;
	'aria-haspopup': Option<string>;
	onClick: Option<(...args: any[]) => any>;
	getRef: Option<(...args: any[]) => any>;
	style: Option<{}>;
};

const VeggieBurgerButton = ({
	children,
	label,
	getRef,
	...otherProps
}: PropTypes) => (
	<button
		className="component-veggie-burger-button"
		ref={getRef}
		{...otherProps}
	>
		<span className="visually-hidden">{label}</span>
		{children}
	</button>
);

VeggieBurgerButton.defaultProps = {
	'aria-haspopup': null,
	// eslint-disable-line react/default-props-match-prop-types
	onClick: null,
	style: null,
	getRef: null,
};
export default VeggieBurgerButton;
