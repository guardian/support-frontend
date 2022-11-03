import { css, ThemeProvider } from '@emotion/react';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
`;

export type DefaultPaymentButtonProps = {
	buttonText: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function DefaultPaymentButton({
	buttonText,
	onClick,
}: DefaultPaymentButtonProps): JSX.Element {
	return (
		<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
			<Button cssOverrides={buttonOverrides} onClick={onClick}>
				{buttonText}
			</Button>
		</ThemeProvider>
	);
}
