import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ContributionAmountOtherAmountFieldProps } from './ContributionAmountOtherAmountField';
import { ContributionAmountOtherAmountField } from './ContributionAmountOtherAmountField';

describe('ContributionAmountOtherAmountField', () => {
	it('calls the onChange callback when a user types in the field', async () => {
		const onChange = jest.fn();

		renderComponent({ onChange });

		await userEvent.type(screen.getByTestId('other-amount-input'), '10.00');

		expect(onChange).toHaveBeenCalledTimes(5);
	});

	it('calls the onBlur callback when a user blurs the field', () => {
		const onBlur = jest.fn();

		renderComponent({ onBlur });

		screen.getByTestId('other-amount-input').focus();
		screen.getByTestId('other-amount-input').blur();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it("doesn't display an error message when the amount is valid", () => {
		renderComponent({ amount: '10.00', canShowErrorMessage: true });

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('displays an error message when the amount is empty', () => {
		renderComponent({ amount: '', canShowErrorMessage: true });

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('displays an error message when the amount is not a number', () => {
		renderComponent({ amount: 'foo', canShowErrorMessage: true });

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('displays an error message when the amount has too many decimal places', () => {
		renderComponent({ amount: '10.000', canShowErrorMessage: true });

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

// ---- Helpers ---- //

function renderComponent({
	amount = '',
	currency = 'GBP',
	countryGroupId = 'GBPCountries',
	contributionType = 'ONE_OFF',
	canShowErrorMessage = false,
	min: minAmount = 5,
	max: maxAmount = 20,
	onChange = jest.fn(),
	onBlur = jest.fn(),
	localCurrencyCountry = undefined,
	useLocalCurrency = false,
}: Partial<ContributionAmountOtherAmountFieldProps>) {
	render(
		<ContributionAmountOtherAmountField
			amount={amount}
			countryGroupId={countryGroupId}
			contributionType={contributionType}
			currency={currency}
			min={minAmount}
			max={maxAmount}
			onChange={onChange}
			onBlur={onBlur}
			canShowErrorMessage={canShowErrorMessage}
			localCurrencyCountry={localCurrencyCountry}
			useLocalCurrency={useLocalCurrency}
		/>,
	);
}
