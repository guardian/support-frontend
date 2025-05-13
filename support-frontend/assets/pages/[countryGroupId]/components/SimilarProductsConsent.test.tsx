import { fireEvent, render, screen } from '@testing-library/react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';
import SimilarProductsConsent, { CONSENT_ID } from './SimilarProductsConsent';

jest.mock('../../../helpers/tracking/behaviour', () => ({
	trackComponentClick: jest.fn(),
}));

describe('SimilarProductsConsent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders a hidden input with the correct name and default value "true"', () => {
		render(<SimilarProductsConsent />);

		const consentInput = screen.getByTestId('consentValue');

		expect(consentInput).toHaveAttribute('name', CONSENT_ID);
		expect(consentInput).toHaveAttribute('value', 'true');
	});

	it('calls trackComponentClick with "false" when checkbox is unchecked', () => {
		render(<SimilarProductsConsent />);
		const checkbox = screen.getByRole('checkbox');

		// Uncheck the checkbox
		fireEvent.click(checkbox);

		const consentInput = screen.getByTestId('consentValue');
		expect(consentInput).toHaveAttribute('value', 'false');

		expect(trackComponentClick).toHaveBeenCalledWith(CONSENT_ID, 'false');
	});

	it('toggles the checkbox back to checked and tracks with "true"', () => {
		render(<SimilarProductsConsent />);
		const checkbox = screen.getByRole('checkbox');

		// Uncheck and then re-check
		fireEvent.click(checkbox); // false
		fireEvent.click(checkbox); // true

		const consentInput = screen.getByTestId('consentValue');
		expect(consentInput).toHaveAttribute('value', 'true');

		expect(trackComponentClick).toHaveBeenLastCalledWith(CONSENT_ID, 'true');
	});
});
