import { useTheme } from '@emotion/react';
import { themeButton } from '@guardian/source/react-components';
import { fireEvent, render, screen } from '@testing-library/react';
import { observerThemeButton } from 'components/observer-layout/styles';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import ThankYouNavLinks from './ThankYouNavLinks';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- test mock returns JSX/any which is safe in this test context
jest.mock('@emotion/react', () => ({
	...jest.requireActual('@emotion/react'),
	useTheme: jest.fn(),
}));

jest.mock('components/observer-layout/observerButtonProps', () => ({
	getObserverButtonProps: jest.fn(() => ({
		icon: <span data-testid="mock-icon" />,
		iconSide: 'right',
		priority: 'primary',
	})),
}));

jest.mock('helpers/tracking/behaviour', () => ({
	trackComponentClick: jest.fn(),
}));

describe('ThankYouNavLinks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the Observer button for observer product and observerThemeButton are present', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({
			observerThemeButton,
		});

		// Act
		render(<ThankYouNavLinks productKey="HomeDelivery" ratePlanKey="Sunday" />);

		const button = screen.getByRole('link', { name: /get started/i });
		expect(button).toHaveAttribute(
			'href',
			'https://www.observer.co.uk/welcome',
		);

		// Assert
		expect(button).toHaveStyle({
			color: observerThemeButton.textPrimary,
			backgroundColor: observerThemeButton.backgroundPrimary,
		});
		expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
	});

	it('renders "Return to the Observer" when observerPrint exists but no observerThemeButton', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: undefined });

		// Act
		render(<ThankYouNavLinks productKey="HomeDelivery" ratePlanKey="Sunday" />);

		// Assert
		expect(
			screen.getByRole('link', { name: /return to the observer/i }),
		).toBeInTheDocument();
	});

	it('renders Guardian link when not ad-lite and no observer theme with the correct colours', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: undefined });

		// Act
		render(
			<ThankYouNavLinks productKey="HomeDelivery" ratePlanKey="Everyday" />,
		);

		const button = screen.getByRole('link', {
			name: /return to the guardian/i,
		});

		// Assert
		expect(button).toHaveAttribute('href', 'https://www.theguardian.com');

		expect(button).toHaveStyle({
			color: themeButton.textTertiary,
			backgroundColor: themeButton.backgroundTertiary,
		});
	});

	it('does not render Guardian link in ad-lite mode', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: undefined });

		// Act
		render(
			<ThankYouNavLinks productKey="GuardianAdLite" ratePlanKey="Monthly" />,
		);

		// Assert
		expect(
			screen.queryByText(/return to the guardian/i),
		).not.toBeInTheDocument();
	});

	it('calls correct tracking function when Observer button is clicked', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: {} });

		// Act
		render(<ThankYouNavLinks productKey="HomeDelivery" ratePlanKey="Sunday" />);

		fireEvent.click(screen.getByRole('link', { name: /get started/i }));

		// Assert
		expect(trackComponentClick).toHaveBeenCalledWith(
			OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER,
		);
	});

	it('calls correct tracking function when Guardian button is clicked', () => {
		// Arrange
		(useTheme as jest.Mock).mockReturnValue({ observerThemeButton: undefined });

		// Act
		render(
			<ThankYouNavLinks productKey="HomeDelivery" ratePlanKey="Everyday" />,
		);

		fireEvent.click(
			screen.getByRole('link', { name: /return to the guardian/i }),
		);

		// Assert
		expect(trackComponentClick).toHaveBeenCalledWith(
			OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
		);
	});
});
