// ----- Imports ----- //

// ----- Tests ----- //
import { parseCustomerData } from 'components/csr/csrMode';

describe('parseCustomerData', () => {
	it('should correctly parse Salesforce json', () => {
		const json = JSON.stringify({
			customer: {
				salutation: 'Mr',
				street: 'Kings Place, York Way',
				state: 'AR',
				postcode: 'N1 9GU',
				lastName: 'Bates',
				firstName: 'Rupert',
				email: 'rupert.bates@guardian.co.uk',
				country: 'United States',
				city: 'London',
			},
			csr: {
				lastName: 'Bates',
				firstName: 'Rupert',
			},
			caseId: null,
		});
		const customerData = parseCustomerData(json);
		expect(customerData.customer.state).toBe('AR');
		expect(customerData.customer.country).toBe('US');
		expect(customerData.customer.title).toBe('Mr');
	});
});
