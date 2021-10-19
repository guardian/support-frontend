// ----- Imports ----- //
import { mapFields } from '../googleTagManager';
import { DirectDebit } from '../../forms/paymentMethods';
// ----- Tests ----- //
jest.mock('ophan', () => ({
	viewId: '123456',
}));
describe('googleTagManager', () => {
	it('should map a support frontend PaymentMethod type to Ophan payment methods', () => {
		const input = {
			orderId: 1,
			currency: 'GBP',
			paymentMethod: DirectDebit,
		};
		const mapped = mapFields(input);
		expect(mapped.paymentMethod).toEqual('Gocardless');
		expect(mapped.currency).toEqual('GBP');
		expect(mapped.orderId).toEqual(1);
		expect(Object.keys(mapped).length).toEqual(Object.keys(input).length);
	});
});
