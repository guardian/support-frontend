import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { brandAlt, neutral, opinion } from '@guardian/source/foundations';
import type { ButtonProps } from '@guardian/source/react-components';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';

const buttonOverrides = (theme: Theme) => css`
	width: 100%;
	justify-content: center;
	color: ${theme.organisation === 'observer' ? neutral[100] : neutral[7]};
	background-color: ${theme.organisation === 'observer'
		? opinion[400]
		: brandAlt[400]};

	:hover {
		background-color: ${theme.organisation === 'observer'
			? opinion[200]
			: brandAlt[200]};
		transition: 0.7s;
	}
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
	const theme = useTheme();
	return (
		<Button
			id={id}
			cssOverrides={buttonOverrides(theme)}
			isLoading={false}
			{...buttonProps}
			theme={themeButtonReaderRevenueBrand}
		>
			{buttonText}
		</Button>
	);
}
