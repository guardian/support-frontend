import '__mocks__/stripeMock';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { mockFetch } from '__mocks__/fetchMock';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import WeeklyCheckoutForm from './weeklyCheckoutForm';

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const store = configureStore({
		reducer: combineReducers({
			page: createReducer(),
			common: commonReducer,
		}),
		preloadedState: initialState,
	});
	store.dispatch(setInitialCommonState(initialState.common));
	return store;
}

jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	isSwitchOn: jest.fn(),
	getSettings: jest.fn(),
	getGlobal: jest.fn(),
}));

const mock = (mockFn: unknown) => mockFn as jest.Mock;

describe('Guardian Weekly checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();
	let initialState: unknown;
	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					formErrors: [],
					billingAddressIsSame: true,
				},
				checkoutForm: {
					product: {
						productType: GuardianWeekly,
						billingPeriod: 'Monthly',
						productOption: 'NoProductOptions',
						fulfilmentOption: 'Domestic',
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

			it('shows the direct debit option when the currency is GBP and the delivery address is in the UK', () => {
				expect(screen.queryByText('Direct debit')).toBeInTheDocument();
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
		});

		describe('with only paypal switch on', () => {
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

			it('does not show the direct debit option', () => {
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

			it('does not show the direct debit option', () => {
				expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
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

		it('should display an error if a silly character is entered into an input field', async () => {
			const firstNameInput = await screen.findByLabelText('First name');
			fireEvent.change(firstNameInput, {
				target: {
					value: 'jane✅',
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
});
