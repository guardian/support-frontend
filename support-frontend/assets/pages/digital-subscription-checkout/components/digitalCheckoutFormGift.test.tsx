/* eslint-disable react/prop-types */
import React from 'react';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { fireEvent, render, screen } from '@testing-library/react';
import { digitalProducts } from '__mocks__/productInfoMocks';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createCommonReducer } from 'helpers/page/commonReducer';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import DigitalCheckoutFormGift from './digitalCheckoutFormGift';

const pageReducer = (commonState) =>
	createCheckoutReducer(
		commonState.internationalisation.countryId,
		DigitalPack,
		'',
		null,
		null,
		null,
	);

function setUpStore(initialState) {
	return createStore(
		combineReducers({
			page: pageReducer(initialState.common),
			common: createCommonReducer(initialState.common),
		}),
		initialState,
		compose(applyMiddleware(thunk)),
	);
}

function renderWithStore(
	component,
	{ initialState, store = setUpStore(initialState), ...renderOptions } = {},
) {
	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>;
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
			initialState,
		});
	});
	describe('Payment methods', () => {
		it('shows the direct debit option when the currency is GBP and the billing address is in the UK', async () => {
			expect(await screen.queryByText('Direct debit')).toBeInTheDocument();
		});
		it('does not show the direct debit option when the currency is not GBP', async () => {
			const countrySelect = await screen.findByLabelText('Country');
			fireEvent.change(countrySelect, {
				target: {
					value: 'US',
				},
			});
			expect(await screen.queryByText('Direct debit')).not.toBeInTheDocument();
		});
	});
});
