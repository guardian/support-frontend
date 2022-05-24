import '__mocks__/stripeMock';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { mockFetch } from '__mocks__/fetchMock';
import { digitalProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { CommonState } from 'helpers/redux/commonState/state';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import DigitalCheckoutForm from './digitalCheckoutForm';

const pageReducer = (commonState: CommonState) =>
	createCheckoutReducer(
		commonState.internationalisation.countryId,
		DigitalPack,
		'Monthly',
		null,
		null,
		null,
	);

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const store = configureStore({
		reducer: combineReducers({
			page: pageReducer(initialState.common),
			common: commonReducer,
		}),
		preloadedState: initialState,
	});
	store.dispatch(setInitialCommonState(initialState.common));
	return store;
}

describe('Digital checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();
	let initialState;
	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					product: 'DigitalPack',
					billingPeriod: 'Monthly',
					productOption: 'NoProductOptions',
					fulfilmentOption: 'NoFulfilmentOptions',
					productPrices: digitalProducts,
					formErrors: [],
				},
				billingAddress: {
					fields: {
						country: 'GB',
						formErrors: [],
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

		renderWithStore(<DigitalCheckoutForm />, {
			// @ts-expect-error -- Type mismatch is unimportant for tests
			initialState,
			// @ts-expect-error -- Type mismatch is unimportant for tests
			store: setUpStore(initialState),
		});
	});
	describe('Payment methods', () => {
		it('shows the direct debit option when the currency is GBP and the billing address is in the UK', () => {
			expect(screen.queryByText('Direct debit')).toBeInTheDocument();
		});
		it('does not show the direct debit option when the currency is not GBP', async () => {
			const countrySelect = await screen.findByLabelText('Country');
			fireEvent.change(countrySelect, {
				target: {
					value: 'US',
				},
			});
			expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
		});
	});
	describe('Validation', () => {
		it('should display an error if a silly character is entered into an input field', async () => {
			const firstNameInput = await screen.findByLabelText('First name');
			fireEvent.change(firstNameInput, {
				target: {
					value: 'jane✅',
				},
			});
			const creditDebit = await screen.findByLabelText('Credit/Debit card');
			fireEvent.click(creditDebit);
			const freeTrialButton = await screen.findByRole(
				'button',
				{
					name: 'Start your free trial now',
				},
				{
					timeout: 2000,
				},
			);
			fireEvent.click(freeTrialButton);
			expect(
				screen.queryAllByText(
					'Please use only letters, numbers and punctuation.',
				),
			).toBeTruthy();
		});
	});
});
