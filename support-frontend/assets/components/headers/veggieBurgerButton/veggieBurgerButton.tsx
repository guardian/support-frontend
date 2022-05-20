import type { AriaAttributes, ReactNode } from 'react';
import './veggieBurgerButton.scss';

type PropTypes = {
	children: ReactNode;
	label: string;
	'aria-haspopup'?: AriaAttributes['aria-haspopup'];
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	getRef?: (element: HTMLButtonElement | null) => void;
	style?: Record<string, string | number>;
};

function VeggieBurgerButton({
	children,
	label,
	getRef,
	...otherProps
}: PropTypes): JSX.Element {
	return (
		<button
			className="component-veggie-burger-button"
			ref={getRef}
			{...otherProps}
		>
			<span className="visually-hidden">{label}</span>
			{children}
		</button>
	);
}

VeggieBurgerButton.defaultProps = {
	'aria-haspopup': false,
};

export default VeggieBurgerButton;
