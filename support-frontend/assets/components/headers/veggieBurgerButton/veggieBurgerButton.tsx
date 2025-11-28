import type { SerializedStyles } from '@emotion/react';
import type { AriaAttributes, ReactNode, Ref } from 'react';
import { buttonOpen } from './veggieBurgerButtonStyles';

type PropTypes = {
	children: ReactNode;
	label: string;
	'aria-haspopup'?: AriaAttributes['aria-haspopup'];
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	ref?: Ref<HTMLButtonElement>;
	style?: Record<string, string | number>;
	cssOverride?: SerializedStyles;
};

function VeggieBurgerButton({
	children,
	label,
	ref,
	cssOverride,
	...otherProps
}: PropTypes): JSX.Element {
	return (
		<button css={[buttonOpen, cssOverride]} ref={ref} {...otherProps}>
			<span className="visually-hidden">{label}</span>
			{children}
		</button>
	);
}

VeggieBurgerButton.defaultProps = {
	'aria-haspopup': false,
};

export default VeggieBurgerButton;
