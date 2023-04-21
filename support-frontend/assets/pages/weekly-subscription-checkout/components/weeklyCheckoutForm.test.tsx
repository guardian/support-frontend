/* eslint-disable eslint-comments/require-description -- This is a mocks file, it is not intended to be good code! */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '__mocks__/stripeMock';
import { fireEvent, screen } from '@testing-library/react';
import { mockFetch } from '__mocks__/fetchMock';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createTestStoreForSubscriptions } from '../../../__test-utils__/testStore';
import type { BillingPeriod } from '../../../helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from '../../../helpers/productPrice/fulfilmentOptions';
import { getWeeklyFulfilmentOption } from '../../../helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from '../../../helpers/productPrice/productOptions';
import { NoProductOptions } from '../../../helpers/productPrice/productOptions';
import { setProductPrices } from '../../../helpers/redux/checkout/product/actions';
import type { SubscriptionsStore } from '../../../helpers/redux/subscriptionsStore';
import { formatMachineDate } from '../../../helpers/utilities/dateConversions';
import WeeklyCheckoutForm from './weeklyCheckoutForm';

function setUpStore(
	initialState: WithDeliveryCheckoutState,
): SubscriptionsStore {
	const store = createTestStoreForSubscriptions(
		GuardianWeekly,
		'Monthly',
		formatMachineDate(new Date()),
		NoProductOptions,
		getWeeklyFulfilmentOption,
	);
	store.dispatch(setProductPrices(weeklyProducts));
	store.dispatch(setInitialCommonState(initialState.common));
	return store;
}

jest.mock('helpers/globalsAndSwitches/globals', () => {
	const actualGlobalsAndSwitches = jest.requireActual(
		'helpers/globalsAndSwitches/globals',
	);

	return {
		...actualGlobalsAndSwitches,
		isSwitchOn: jest.fn(),
	};
});
const mock = (mockFn: unknown) => mockFn as jest.Mock;

describe('Guardian Weekly checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();

	let initialState: unknown;
	const billingPeriod: BillingPeriod = 'Monthly';
	const productOption: ProductOptions = 'NoProductOptions';
	const fulfilmentOption: FulfilmentOptions = 'Domestic';

	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					formErrors: [],
				},
				checkoutForm: {
					product: {
						productType: GuardianWeekly,
						billingPeriod,
						productOption,
						fulfilmentOption,
						productPrices: weeklyProducts,
					},
					billingAddress: {
						fields: {
							country: 'GB',
							errors: [],
						},
					},
					deliveryAddress: {
						fields: {
							country: 'GB',
							errors: [],
						},
					},
					addressMeta: {
						billingAddressMatchesDelivery: true,
					},
				},
			},
			common: {
				internationalisation: {
					countryGroupId: 'GBPCountries',
					countryId: 'GB',
					currencyId: 'GBP',
				},
				abParticipations: [],
			},
		};

		mockFetch({
			client_secret: 'super secret',
		});
	});

	describe('Payment methods', () => {
		describe('with all switches on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(() => true);

				renderWithStore(<WeeklyCheckoutForm />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('shows all payment options', () => {
				expect(screen.queryByText('PayPal')).toBeInTheDocument();
				expect(screen.queryByText('Direct debit')).toBeInTheDocument();
				expect(screen.queryByText('Credit/Debit card')).toBeInTheDocument();
			});

			it('does not show the direct debit option when the delivery address is outside the UK', async () => {
				const countrySelect = await screen.findByLabelText('Country');
				fireEvent.change(countrySelect, {
					target: {
						value: 'DE',
					},
				});
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});

			it('shows the direct debit option when the currency is GBP and the delivery address is in the UK', () => {
				expect(screen.queryByText('Direct debit')).toBeInTheDocument();
			});
		});

		describe('with only PayPal switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.paypal',
				);

				renderWithStore(<WeeklyCheckoutForm />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the direct debit option', () => {
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
				expect(screen.queryByText('Credit/Debit card')).not.toBeInTheDocument();
			});
		});

		describe('with only direct debit switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.directDebit',
				);

				renderWithStore(<WeeklyCheckoutForm />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the PayPal option', () => {
				expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
				expect(screen.queryByText('Credit/Debit card')).not.toBeInTheDocument();
			});
		});

		describe('with only credit/debit card switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.creditCard',
				);

				renderWithStore(<WeeklyCheckoutForm />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the PayPal option', () => {
				expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
			});
			it('does not show the direct debit option', () => {
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});
		});
	});

	describe('Validation', () => {
		beforeEach(() => {
			mock(isSwitchOn).mockImplementation(() => true);

			renderWithStore(<WeeklyCheckoutForm />, {
				initialState,
				// @ts-expect-error -- Type mismatch is unimportant for tests
				store: setUpStore(initialState),
			});
		});

		it('should display an error if a non-zuora-compatible character is entered into an input field', async () => {
			const firstNameInput = await screen.findByLabelText('First name');
			fireEvent.change(firstNameInput, {
				target: {
					value: 'jane 😊',
				},
			});
			const creditDebit = await screen.findByLabelText('Credit/Debit card');
			fireEvent.click(creditDebit);
			const payNowButton = await screen.findByRole(
				'button',
				{
					name: 'Pay now',
				},
				{
					timeout: 2000,
				},
			);
			fireEvent.click(payNowButton);
			expect(
				screen.queryAllByText(
					'Please use only letters, numbers and punctuation.',
				).length,
			).toBeGreaterThan(0);
		});

		it('should not display an error message when only valid characters are entered', async () => {
			const firstNameInput = await screen.findByLabelText('First name');
			fireEvent.change(firstNameInput, {
				target: {
					// This is a right single quotation character, *not* an apostrophe
					value: 'O’Connor',
				},
			});
			const creditDebit = await screen.findByLabelText('Credit/Debit card');
			fireEvent.click(creditDebit);
			const payNowButton = await screen.findByRole(
				'button',
				{
					name: 'Pay now',
				},
				{
					timeout: 2000,
				},
			);
			fireEvent.click(payNowButton);
			expect(
				screen.queryAllByText(
					'Please use only letters, numbers and punctuation.',
				),
			).toHaveLength(0);
		});
	});

	describe('Pricing internationalisation', () => {
		beforeEach(() => {
			mock(isSwitchOn).mockImplementation(() => true);

			renderWithStore(<WeeklyCheckoutForm />, {
				initialState,
				// @ts-expect-error -- Type mismatch is unimportant for tests
				store: setUpStore(initialState),
			});
		});

		it('should display correct prices based on delivery address country (regardless of billing address country)', async () => {
			const addressIsNotSame = await screen.findByRole('radio', {
				name: 'No',
			});
			fireEvent.click(addressIsNotSame);

			const [Germany, UnitedKingdom] = ['DE', 'GB'];
			const [deliveryAddressCountry, billingAddressCountry] =
				await screen.findAllByLabelText('Country');
			fireEvent.change(deliveryAddressCountry, {
				target: {
					value: Germany,
				},
			});
			fireEvent.change(billingAddressCountry, {
				target: {
					value: UnitedKingdom,
				},
			});

			const expectedPrice: number =
				// @ts-expect-error -- `weeklyProducts` is a hard-coded mock, no risk of null values
				weeklyProducts['Europe'][fulfilmentOption][productOption][
					billingPeriod
				]['EUR']['price'];

			expect(
				screen.queryAllByText(new RegExp(`€${expectedPrice}.+per month`))
					.length,
			).toBeGreaterThan(0);
		});
	});
});
