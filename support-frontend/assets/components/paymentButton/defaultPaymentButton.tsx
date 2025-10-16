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
	color: ${neutral[7]};
	background-color: ${theme.organisation === 'guardian'
		? brandAlt[400]
		: opinion[400]};
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
