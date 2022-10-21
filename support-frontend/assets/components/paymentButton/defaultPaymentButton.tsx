import { css, ThemeProvider } from '@emotion/react';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
`;

function getButtonPrice(
	amountWithCurrency: string,
	paymentInterval?: 'month' | 'year',
) {
	if (paymentInterval) {
		return `${amountWithCurrency} per ${paymentInterval}`;
	}

	return amountWithCurrency;
}

export type DefaultPaymentButtonProps = {
	amountWithCurrency: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	paymentInterval?: 'month' | 'year';
};

export function DefaultPaymentButton({
	amountWithCurrency,
	onClick,
	paymentInterval,
}: DefaultPaymentButtonProps): JSX.Element {
	const buttonPrice = getButtonPrice(amountWithCurrency, paymentInterval);

	return (
		<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
			<Button cssOverrides={buttonOverrides} onClick={onClick}>
				Pay {buttonPrice}
			</Button>
		</ThemeProvider>
	);
}
