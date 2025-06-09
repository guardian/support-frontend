/**
 * @group integration
 */

import { getPayPalConfig, PayPalService } from '../services/payPal';

test('PayPal config', async () => {
	const result = await getPayPalConfig('CODE');
	expect(result.url).toBe('https://api-3t.sandbox.paypal.com/nvp');
});

test('PayPal', async () => {
	const config = await getPayPalConfig('CODE');
	const payPalService = new PayPalService(config);
	const result = await payPalService.retrieveEmail('B-3CG39635EM902001K');
	console.log(result);
	expect(result?.length).toBeGreaterThan(0);
});
