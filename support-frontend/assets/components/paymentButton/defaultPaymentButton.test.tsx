import { useTheme } from '@emotion/react';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import { render, screen } from '@testing-library/react';
import { observerThemeButton } from 'components/observer-layout/styles';
import { DefaultPaymentButton } from './defaultPaymentButton';

jest.mock('components/observer-layout/observerButtonProps', () => ({
	getObserverButtonProps: () => ({
		icon: <span data-testid="mock-icon" />,
		iconSide: 'right',
	}),
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- test mock returns JSX/any which is safe in this test context
jest.mock('@emotion/react', () => ({
	...jest.requireActual('@emotion/react'),
	useTheme: jest.fn(),
}));

describe('DefaultPaymentButton', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders button with Guardian theme', () => {
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: undefined });

		render(
			<DefaultPaymentButton
				id="pay-button"
				buttonText="Pay Now"
				onClick={() => {}}
			/>,
		);

		const button = screen.getByRole('button', { name: /pay now/i });
		expect(button).toBeInTheDocument();

		expect(button).toHaveStyle({
			color: themeButtonReaderRevenueBrand.textPrimary,
			backgroundColor: themeButtonReaderRevenueBrand.backgroundPrimary,
		});
		expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
	});

	it('renders button with the observer theme', () => {
		(useTheme as jest.Mock).mockReturnValue({
			observerThemeButton,
		});

		render(
			<DefaultPaymentButton buttonText="pay observer" onClick={() => {}} />,
		);

		const button = screen.getByRole('button', { name: /pay observer/i });
		expect(button).toBeInTheDocument();

		expect(button).toHaveStyle({
			color: observerThemeButton.textPrimary,
			backgroundColor: observerThemeButton.backgroundPrimary,
		});
		expect(screen.queryByTestId('mock-icon')).toBeInTheDocument();
	});
});
