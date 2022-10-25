import '__mocks__/stripeMock';
import {
	combineReducers,
	configureStore,
	createListenerMiddleware,
} from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { mockFetch } from '__mocks__/fetchMock';
import { paperProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { addAddressSideEffects } from 'helpers/redux/checkout/address/subscriptionsSideEffects';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import PaperCheckoutForm from './paperCheckoutForm';

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const listenerMiddleware = createListenerMiddleware();

	const store = configureStore({
		reducer: combineReducers({
			page: createReducer(),
			common: commonReducer,
		}),
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().prepend(listenerMiddleware.middleware),
	});

	addAddressSideEffects(
		listenerMiddleware.startListening as SubscriptionsStartListening,
	);

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

describe('Newspaper checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();

	let initialState: unknown;
	beforeEach(() => {
		initialState = {
			page: {
				checkoutForm: {
					product: {
						productType: 'Paper',
						billingPeriod: 'Monthly',
						productOption: 'Everyday',
						fulfilmentOption: 'Collection',
						productPrices: paperProducts,
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

				renderWithStore(<PaperCheckoutForm />, {
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

			it('does not show the direct debit option when the delivery address is in the Isle of Man', async () => {
				const countrySelect = await screen.findByLabelText('Country');
				fireEvent.change(countrySelect, {
					target: {
						value: 'IM',
					},
				});
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});

			it('does not show the direct debit option when the billing address is in the Isle of Man', async () => {
				const addressIsNotSame = await screen.findByRole('radio', {
					name: 'No',
				});
				fireEvent.click(addressIsNotSame);
				const allCountrySelects = await screen.findAllByLabelText('Country');
				fireEvent.change(allCountrySelects[1], {
					target: {
						value: 'IM',
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

				renderWithStore(<PaperCheckoutForm />, {
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

				renderWithStore(<PaperCheckoutForm />, {
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

				renderWithStore(<PaperCheckoutForm />, {
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

			renderWithStore(<PaperCheckoutForm />, {
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
				),
			).toBeTruthy();
		});
	});
});
