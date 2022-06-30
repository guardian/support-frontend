/* eslint-disable @typescript-eslint/require-await -- To simplify mocking of functions that return promises */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { mockFetch } from '__mocks__/fetchMock';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setRecaptchaToken } from 'helpers/redux/checkout/recaptcha/actions';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { SubscriptionsStore } from 'helpers/redux/subscriptionsStore';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import DirectDebitForm from './directDebitForm';

const pageReducer = (initialState: WithDeliveryCheckoutState) =>
	createReducer(formatMachineDate(new Date()));

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const store = configureStore({
		reducer: combineReducers({
			page: pageReducer(initialState),
			common: commonReducer,
		}),
	});
	store.dispatch(setInitialCommonState(initialState.common));
	return store;
}

async function fillOutForm(
	{ name, sortCode, accountNumber }: Record<string, string> = {},
	confirm = true,
) {
	const nameField = await screen.findByLabelText('Bank account holder name');
	const sortCodeField = await screen.findByLabelText('Sort code');
	const accountNumberField = await screen.findByLabelText('Account number');
	const confirmationField = await screen.findByLabelText(
		'I confirm that I am the account holder and I am solely able to authorise debit from the account',
	);
	await act(
		async () =>
			void fireEvent.change(nameField, {
				target: {
					value: name,
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(sortCodeField, {
				target: {
					value: sortCode,
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(accountNumberField, {
				target: {
					value: accountNumber,
				},
			}),
	);
	if (confirm) {
		await act(async () => void fireEvent.click(confirmationField));
	}
}

describe('Direct debit form', () => {
	console.warn = jest.fn();
	console.error = jest.fn();
	let initialState;
	let store: SubscriptionsStore;

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
						billingPeriod: 'Annual',
						productOption: 'NoProductOptions',
						fulfilmentOption: 'Domestic',
						productPrices: weeklyProducts,
					},
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
				directDebit: {
					accountNumber: '',
					accountHolderName: '',
					accountHolderConfirmation: '',
					sortCodeArray: Array(3).fill(''),
					sortCodeString: '',
					formError: null,
					phase: 'entry',
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

		//  @ts-expect-error Unused common state properties
		store = setUpStore(initialState);

		mockFetch({
			accountValid: true,
		});

		renderWithStore(
			<DirectDebitForm
				allErrors={[]}
				buttonText={'Confirm'}
				submissionErrorHeading={'Errors'}
				submissionError={null}
				submitForm={jest.fn()}
			/>,
			{
				//  @ts-expect-error Unused common state properties
				initialState,
				store,
			},
		);
	});

	describe('Form submission - valid form data', () => {
		it("successfully moves to the review stage, showing the user's details", async () => {
			await fillOutForm({
				name: 'Zaphod Beeblebrox',
				sortCode: '200000',
				accountNumber: '11223344',
			});
			// Recaptcha is not rendered in tests so just update the store directly
			store.dispatch(setRecaptchaToken('token'));

			const submitButton = await screen.findByText('Confirm');
			await act(async () => void fireEvent.click(submitButton));

			expect(
				screen.queryByText(
					'If the details above are correct, press confirm to set up your direct debit, otherwise press back to make changes',
				),
			).toBeInTheDocument();
			expect(screen.queryByText('Zaphod Beeblebrox')).toBeInTheDocument();
			expect(screen.queryByText('200000')).toBeInTheDocument();
			expect(screen.queryByText('11223344')).toBeInTheDocument();
		});
	});

	describe('Form submission - invalid form data', () => {
		it('prevents progression if user input is invalid', async () => {
			await fillOutForm({
				name: '',
				sortCode: '',
				accountNumber: '',
			});
			const submitButton = await screen.findByText('Confirm');
			await act(async () => void fireEvent.click(submitButton));
			expect(
				screen.queryAllByText('Please enter a valid account name'),
			).toHaveLength(2);
			expect(
				screen.queryAllByText('Please enter a valid sort code'),
			).toHaveLength(2);
			expect(
				screen.queryAllByText('Please enter a valid account number'),
			).toHaveLength(2);
		});

		it('requires the user to confirm', async () => {
			await fillOutForm(
				{
					name: 'Zaphod Beeblebrox',
					sortCode: '200000',
					accountNumber: '11223344',
				},
				false,
			);
			const submitButton = await screen.findByText('Confirm');
			await act(async () => void fireEvent.click(submitButton));
			expect(
				await screen.findByLabelText(
					'I confirm that I am the account holder and I am solely able to authorise debit from the account',
				),
			).toHaveAttribute('aria-invalid', 'true');
			expect(
				screen.queryByText('Please confirm you are the account holder'),
			).toBeInTheDocument();
		});
	});
});
