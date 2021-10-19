/* eslint-disable react/prop-types */
import '__mocks__/stripeMock';
import React from 'react';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { fireEvent, render, screen } from '@testing-library/react';
import { paperProducts } from '__mocks__/productInfoMocks';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createCommonReducer } from 'helpers/page/commonReducer';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { Paper } from 'helpers/productPrice/subscriptions';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import PaperCheckoutForm from './paperCheckoutForm';

const pageReducer = (initialState) =>
	createWithDeliveryCheckoutReducer(
		initialState.common.internationalisation.countryId,
		Paper,
		Monthly,
		formatMachineDate(new Date()),
		initialState.page.checkout.productOption,
		initialState.page.checkout.fulfilmentOption,
	);

function setUpStore(initialState) {
	return createStore(
		combineReducers({
			page: pageReducer(initialState),
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

describe('Newspaper checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();
	let initialState;
	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					product: 'Paper',
					billingPeriod: 'Monthly',
					productOption: 'Everyday',
					fulfilmentOption: 'Collection',
					productPrices: paperProducts,
					formErrors: [],
				},
				billingAddress: {
					fields: {
						country: 'GB',
						formErrors: [],
					},
				},
				deliveryAddress: {
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

		window.fetch = async () => ({
			json: async () => ({
				client_secret: 'super secret',
			}),
		});

		renderWithStore(<PaperCheckoutForm />, {
			initialState,
		});
	});
	describe('Payment methods', () => {
		it('shows the direct debit option when the currency is GBP and the delivery address is in the UK', async () => {
			expect(await screen.queryByText('Direct debit')).toBeInTheDocument();
		});
		it('does not show the direct debit option when the delivery address is in the Isle of Man', async () => {
			const countrySelect = await screen.findByLabelText('Country');
			fireEvent.change(countrySelect, {
				target: {
					value: 'IM',
				},
			});
			expect(await screen.queryByText('Direct debit')).not.toBeInTheDocument();
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
			expect(await screen.queryByText('Direct debit')).not.toBeInTheDocument();
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
				await screen.queryAllByText(
					'Please use only letters, numbers and punctuation.',
				),
			).toBeTruthy();
		});
	});
});
