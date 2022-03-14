import type { Store } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { digitalProducts } from '__mocks__/productInfoMocks';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { setInitialState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { CommonState } from 'helpers/redux/commonState/state';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import DigitalCheckoutFormGift from './digitalCheckoutFormGift';

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
		// @ts-expect-error - some state properties ignored for testing
		preloadedState: initialState,
	});
	store.dispatch(setInitialState(initialState.common));
	return store;
}

function renderWithStore(
	component: React.ReactElement,
	{
		initialState,
		store = initialState ? setUpStore(initialState) : undefined,
		...renderOptions
	}: { initialState?: WithDeliveryCheckoutState; store?: Store } = {},
) {
	function Wrapper({ children }: { children?: React.ReactNode }) {
		return <>{store && <Provider store={store}>{children}</Provider>}</>;
	}

	return render(component, {
		wrapper: Wrapper,
		...renderOptions,
	});
}

describe('Digital gift checkout form', () => {
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
			},
		};
		renderWithStore(<DigitalCheckoutFormGift />, {
			// @ts-expect-error -- Type mismatch is unimportant for tests
			initialState,
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
});
