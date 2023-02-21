import { css, ThemeProvider } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
	color: ${neutral[7]};
`;

export type DefaultPaymentButtonProps = {
	id?: string;
	buttonText: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
};

export function DefaultPaymentButton({
	id,
	buttonText,
	onClick,
	disabled = false,
}: DefaultPaymentButtonProps): JSX.Element {
	return (
		<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
			<Button
				id={id}
				cssOverrides={buttonOverrides}
				onClick={onClick}
				disabled={disabled}
			>
				{buttonText}
			</Button>
		</ThemeProvider>
	);
}
