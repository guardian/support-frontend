import { fireEvent, render, screen } from '@testing-library/react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';
import SoftOptInCheckoutConsent, {
	type ProductConsent,
	productConsents,
} from './SoftOptInCheckoutConsent';

jest.mock('../../../helpers/tracking/behaviour', () => ({
	trackComponentClick: jest.fn(),
}));

describe('SoftOptInCheckoutConsent', () => {
	const consentKey: ProductConsent = 'similarProductsConsent';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders a hidden input with the correct name and default value "true"', () => {
		render(<SoftOptInCheckoutConsent productConsent={consentKey} />);

		const consentInput = screen.getByTestId('consentValue');

		expect(consentInput).toHaveAttribute('name', consentKey);
		expect(consentInput).toHaveAttribute('value', 'true');
	});

	it('calls trackComponentClick with "false" when checkbox is unchecked', () => {
		render(<SoftOptInCheckoutConsent productConsent={consentKey} />);
		const checkbox = screen.getByRole('checkbox');

		// Uncheck the checkbox
		fireEvent.click(checkbox);

		const consentInput = screen.getByTestId('consentValue');
		expect(consentInput).toHaveAttribute('value', 'false');

		expect(trackComponentClick).toHaveBeenCalledWith(
			productConsents[consentKey],
			'false',
		);
	});

	it('toggles the checkbox back to checked and tracks with "true"', () => {
		render(<SoftOptInCheckoutConsent productConsent={consentKey} />);
		const checkbox = screen.getByRole('checkbox');

		// Uncheck and then re-check
		fireEvent.click(checkbox); // false
		fireEvent.click(checkbox); // true

		const consentInput = screen.getByTestId('consentValue');
		expect(consentInput).toHaveAttribute('value', 'true');

		expect(trackComponentClick).toHaveBeenLastCalledWith(
			productConsents[consentKey],
			'true',
		);
	});
});
