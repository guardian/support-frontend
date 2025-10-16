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
	color: ${theme.organisation === 'guardian' ? neutral[7] : neutral[100]};
	background-color: ${theme.organisation === 'guardian'
		? brandAlt[400]
		: opinion[400]};

	:hover {
		background-color: ${theme.organisation === 'guardian'
			? brandAlt[200]
			: opinion[200]};
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
