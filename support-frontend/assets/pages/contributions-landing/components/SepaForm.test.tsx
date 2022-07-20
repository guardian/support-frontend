import { render, screen } from '@testing-library/react';
import { SepaForm } from './SepaForm';

describe('SEPA Form', () => {
	const updateAddressStreetName = jest.fn();
	const updateAddressCountry = jest.fn();
	const updateIban = jest.fn();
	const updateAccountHolderName = jest.fn();

	beforeEach(() => {
		render(
			<SepaForm
				updateAddressStreetName={updateAddressStreetName}
				updateAddressCountry={updateAddressCountry}
				updateIban={updateIban}
				updateAccountHolderName={updateAccountHolderName}
				checkoutFormHasBeenSubmitted={false}
			/>,
		);
	});

	it('PII fields are in Quantum Metrics Blocklist', () => {
		const elementTestIds = [
			'sepa-account-holder-name-input',
			'sepa-account-number',
			'sepa-address-line-one',
			'sepa-country',
		];

		elementTestIds.forEach((elementTestId) => {
			const element = screen.getByTestId(elementTestId);
			expect(element).toBeInTheDocument();
			expect(element.dataset.qmMasking).toBe('blocklist');
		});
	});
});
