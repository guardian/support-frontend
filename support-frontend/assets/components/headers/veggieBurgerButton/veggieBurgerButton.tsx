import type { SerializedStyles } from '@emotion/react';
import type { AriaAttributes, ReactNode, Ref } from 'react';
import { buttonOpen } from './veggieBurgerButtonStyles';

type PropTypes = {
	children: ReactNode;
	ref?: Ref<HTMLButtonElement>;
	cssOverride?: SerializedStyles;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	style?: Record<string, string | number>;
	'aria-haspopup'?: AriaAttributes['aria-haspopup'];
	'aria-label'?: string;
};

function VeggieBurgerButton({
	children,
	ref,
	cssOverride,
	...otherProps
}: PropTypes): JSX.Element {
	return (
		<button css={[buttonOpen, cssOverride]} ref={ref} {...otherProps}>
			{children}
		</button>
	);
}

VeggieBurgerButton.defaultProps = {
	'aria-haspopup': false,
};

export default VeggieBurgerButton;
