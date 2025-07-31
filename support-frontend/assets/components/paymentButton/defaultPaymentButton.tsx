import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';
import type { ButtonProps } from '@guardian/source/react-components';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
	color: ${neutral[7]};
`;

export type DefaultPaymentButtonProps = ButtonProps & {
	id?: string;
	buttonText: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	type?: HTMLButtonElement['type'];
};

export function DefaultPaymentButton({
	id,
	buttonText,
	...buttonProps
}: DefaultPaymentButtonProps): JSX.Element {
	return (
		<Button
			id={id}
			cssOverrides={buttonOverrides}
			isLoading={false}
			{...buttonProps}
			theme={themeButtonReaderRevenueBrand}
		>
			{buttonText}
		</Button>
	);
}
