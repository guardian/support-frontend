import { css, useTheme } from '@emotion/react';
import type { ButtonProps } from '@guardian/source/react-components';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
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
	const themeOverride = useTheme();
	return (
		<Button
			id={id}
			cssOverrides={buttonOverrides}
			isLoading={false}
			{...buttonProps}
			theme={{ ...themeButtonReaderRevenueBrand, ...themeOverride }}
		>
			{buttonText}
		</Button>
	);
}
