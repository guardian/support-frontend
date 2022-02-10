/* eslint-disable @typescript-eslint/require-await -- To simplify mocking of functions that return promises */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import type { Store } from 'redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { createCommonReducer } from 'helpers/page/commonReducer';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import DirectDebitForm from './directDebitForm';

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
	return createStore(
		combineReducers({
			page: pageReducer(initialState),
			common: createCommonReducer(initialState.common),
		}),
		// @ts-expect-error The type mismatch here really doesn't matter in the context of tests
		initialState,
		compose(applyMiddleware(thunk)),
	);
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

		window.fetch = () =>
			// @ts-expect-error Simple fetch mock
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						accountValid: true,
					}),
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
