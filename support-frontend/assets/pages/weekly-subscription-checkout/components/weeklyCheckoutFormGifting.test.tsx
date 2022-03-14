import type { Store } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setInitialState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import WeeklyCheckoutFormGift from './weeklyCheckoutFormGifting';

const pageReducer = (initialState: WithDeliveryCheckoutState) =>
	createWithDeliveryCheckoutReducer(
		initialState.common.internationalisation.countryId,
		GuardianWeekly,
		'Annual',
		formatMachineDate(new Date()),
		initialState.page.checkout.productOption,
		initialState.page.checkout.fulfilmentOption,
	);

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const store = configureStore({
		reducer: combineReducers({
			page: pageReducer(initialState),
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

describe('Guardian Weekly checkout form', () => {
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
					productOption: 'NoProductOptions',
					fulfilmentOption: 'Domestic',
					productPrices: weeklyProducts,
					formErrors: [],
					billingAddressIsSame: true,
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
			},
		};
		renderWithStore(<WeeklyCheckoutFormGift />, {
			// @ts-expect-error -- Type mismatch is unimportant for tests

			initialState,
		});
	});
	describe('Payment methods', () => {
		it('shows the direct debit option when the currency is GBP and the delivery address is in the UK', () => {
			expect(screen.queryByText('Direct debit')).toBeInTheDocument();
		});
		it('does not show the direct debit option when the delivery address is outside the UK', async () => {
			const countrySelect = await screen.findByLabelText('Country');
			fireEvent.change(countrySelect, {
				target: {
					value: 'US',
				},
			});
			expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
		});
		it('does not show the direct debit option when the billing address is outside the UK', async () => {
			const addressIsNotSame = await screen.findByRole('radio', {
				name: 'No',
			});
			fireEvent.click(addressIsNotSame);
			const allCountrySelects = await screen.findAllByLabelText('Country');
			fireEvent.change(allCountrySelects[1], {
				target: {
					value: 'FR',
				},
			});
			expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
		});
	});
});
