import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Elements } from '@stripe/react-stripe-js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '__mocks__/settingsMock';
import { AbParticipationsProvider } from 'contexts/AbParticipationsContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import type { PaymentResult } from 'helpers/forms/paymentIntegrations/oneOffContributions';
import { postOneOffPayPalCreatePaymentRequest } from 'helpers/forms/paymentIntegrations/oneOffContributions';
import {
	clearThankYouOrder,
	getThankYouOrder,
	setThankYouOrder,
} from '../checkout/helpers/sessionStorage';
import { OneTimeCheckoutComponent } from './oneTimeCheckoutComponent';

jest.mock('helpers/forms/paymentIntegrations/oneOffContributions', () => ({
	postOneOffPayPalCreatePaymentRequest: jest.fn(),
}));

jest.mock('../checkout/components/PersonalEmailFields', () => ({
	PersonalEmailFields: () => null,
}));

const email = 'supporter@example.com';
const amount = 20;
const redirect = jest.fn();

beforeEach(() => {
	redirect.mockClear();
	const location = window.location;
	jest.spyOn(window, 'location', 'get').mockReturnValue({
		...location,
		get href() {
			return location.href;
		},
		set href(url: string) {
			redirect(url, getThankYouOrder());
		},
	});
});

afterEach(() => {
	jest.restoreAllMocks();
	clearThankYouOrder();
});

function submitPayPalCheckout(result: PaymentResult) {
	jest.mocked(postOneOffPayPalCreatePaymentRequest).mockResolvedValue(result);
	render(
		<Elements stripe={null}>
			<AbParticipationsProvider participations={{}}>
				<OneTimeCheckoutComponent
					supportRegionId={SupportRegionId.UK}
					appConfig={{ ...window.guardian, user: { id: 'supporter', email } }}
					stripePublicKey="unused"
					countryId="GB"
					useStripeExpressCheckout={false}
					landingPageSettings={fallBackLandingPageSelection}
					oneTimeCheckoutSettings={{
						name: 'CONTROL',
						heading: 'Support just once',
						subheading: '',
						amounts: {
							amounts: [amount],
							defaultAmount: amount,
							hideChooseYourAmount: false,
						},
					}}
					userAttributes={{}}
				/>
			</AbParticipationsProvider>
		</Elements>,
	);
	fireEvent.click(screen.getByRole('radio', { name: 'PayPal' }));
	fireEvent.click(screen.getByRole('button', { name: /with PayPal/ }));
}

it('stores the pending order before redirecting to PayPal for approval', async () => {
	const approvalUrl = 'https://paypal.example.com/approve';
	submitPayPalCheckout({
		type: 'paypal',
		result: { type: 'success', data: { approvalUrl } },
	});

	await waitFor(() => expect(redirect).toHaveBeenCalledTimes(1));
	expect(redirect).toHaveBeenCalledWith(approvalUrl, {
		firstName: '',
		email,
		paymentMethod: 'PayPal',
		status: 'pending',
		finalAmount: amount,
	});
});

it('clears the previous order if PayPal payment creation fails', async () => {
	setThankYouOrder({
		firstName: '',
		email,
		paymentMethod: 'PayPal',
		status: 'success',
	});
	submitPayPalCheckout({
		type: 'paypal',
		result: { type: 'error', error: { message: 'Payment unavailable' } },
	});

	await screen.findByText('Sorry, something went wrong.');
	expect(getThankYouOrder()).toBeUndefined();
	expect(redirect).not.toHaveBeenCalled();
});
