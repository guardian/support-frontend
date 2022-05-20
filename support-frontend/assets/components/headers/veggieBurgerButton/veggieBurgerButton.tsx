import type { AriaAttributes, ReactNode, Ref } from 'react';
import './veggieBurgerButton.scss';

type PropTypes = {
	children: ReactNode;
	label: string;
	'aria-haspopup'?: AriaAttributes['aria-haspopup'];
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	ref?: Ref<HTMLButtonElement>;
	style?: Record<string, string | number>;
};

function VeggieBurgerButton({
	children,
	label,
	ref,
	...otherProps
}: PropTypes): JSX.Element {
	return (
		<button
			className="component-veggie-burger-button"
			ref={ref}
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
