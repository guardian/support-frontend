/* eslint-disable @typescript-eslint/require-await -- To simplify mocking of functions that return promises */
import '__mocks__/stripeMock';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import type { PropTypes } from './directDebitForm';
import DirectDebitForm from './directDebitForm';

async function fillOutForm() {
	const name = await screen.findByLabelText('Bank account holder name');
	const sortCode = await screen.findByLabelText('Sort code');
	const accountNumber = await screen.findByLabelText('Account number');
	const confirmation = await screen.findByLabelText(
		'I confirm that I am the account holder and I am solely able to authorise debit from the account',
	);
	await act(
		async () =>
			void fireEvent.change(name, {
				target: {
					value: 'Zaphod Beeblebrox',
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(sortCode, {
				target: {
					value: '200000',
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(accountNumber, {
				target: {
					value: '11223344',
				},
			}),
	);
	await act(async () => void fireEvent.click(confirmation));
}

describe('Stripe Form', () => {
	let props: PropTypes;
	let form: RenderResult;
	let submitForm: () => void;
	let updateSortCodeString: () => void;
	let updateAccountNumber: () => void;
	let updateAccountHolderName: () => void;
	let updateAccountHolderConfirmation: () => void;
	let payDirectDebitClicked: () => void;
	let editDirectDebitClicked: () => void;

	beforeEach(async () => {
		submitForm = jest.fn();
		updateSortCodeString = jest.fn();
		updateAccountNumber = jest.fn();
		updateAccountHolderName = jest.fn();
		updateAccountHolderConfirmation = jest.fn();
		payDirectDebitClicked = jest.fn();
		editDirectDebitClicked = jest.fn();
		props = {
			buttonText: 'Pay now',
			submissionErrorHeading: 'Errors',
			submissionError: null,
			allErrors: [],
			sortCodeString: '',
			accountNumber: '',
			accountHolderName: '',
			accountHolderConfirmation: false,
			updateSortCodeString,
			updateAccountNumber,
			updateAccountHolderName,
			updateAccountHolderConfirmation,
			submitForm,
			payDirectDebitClicked,
			editDirectDebitClicked,
			countryGroupId: 'GBPCountries',
			phase: 'entry',
			formError: null,
		};

		// @ts-expect-error This doesn't precisely match the fetch API type but that's OK
		window.fetch = async () => ({
			json: async () => ({
				client_secret: 'super secret',
			}),
		});

		// Async render as StripeForm does a bunch of internal async set up
		await act(async () => {
			form = render(<DirectDebitForm {...props} />);
		});
	});

	describe('Form submission - valid form data', () => {
		it('successfully requests confirmation', async () => {
			console.log(form.debug())
			await fillOutForm();
			const submitButton = await screen.findByText('Confirm');
			await act(async () => void fireEvent.click(submitButton));
			expect(payDirectDebitClicked).toHaveBeenCalled();
		});
	});
});
