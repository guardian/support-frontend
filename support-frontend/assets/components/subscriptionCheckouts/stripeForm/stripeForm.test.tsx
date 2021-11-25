/* eslint-disable @typescript-eslint/require-await -- To simplify mocking of functions that return promises */
import '__mocks__/stripeMock';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import type { Option } from 'helpers/types/option';
import type { PropTypes } from './stripeProviderForCountry';
import { StripeProviderForCountry } from './stripeProviderForCountry';

async function fillOutForm() {
	const cardNumber = await screen.findByLabelText('Card number');
	const expiry = await screen.findByLabelText('Expiry date');
	const cvc = await screen.findByLabelText('CVC');
	await act(
		async () =>
			void fireEvent.change(cardNumber, {
				target: {
					value: '4242424242424242',
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(expiry, {
				target: {
					value: '0230',
				},
			}),
	);
	await act(
		async () =>
			void fireEvent.change(cvc, {
				target: {
					value: '123',
				},
			}),
	);
}

describe('Stripe Form', () => {
	let props: PropTypes;
	let stripeForm: RenderResult;
	let submitForm: () => void;
	let validateForm: () => void;
	let setStripePaymentMethod: (stripePaymentMethod: Option<string>) => void;

	beforeEach(async () => {
		submitForm = jest.fn();
		validateForm = jest.fn();
		setStripePaymentMethod = jest.fn();
		props = {
			country: 'GB',
			isTestUser: true,
			allErrors: [],
			setStripePaymentMethod,
			submitForm,
			validateForm,
			buttonText: 'Button',
			csrf: {
				token: 'mock token',
			},
		};

		// @ts-expect-error This doesn't precisely match the fetch API type but that's OK
		window.fetch = async () => ({
			json: async () => ({
				client_secret: 'super secret',
			}),
		});

		// Async render as StripeForm does a bunch of internal async set up
		await act(async () => {
			stripeForm = render(<StripeProviderForCountry {...props} />);
		});
	});

	describe('Form submission - valid form data', () => {
		beforeEach(fillOutForm);
		it('allows submission when form input is valid', async () => {
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).toHaveBeenCalled();
			expect(submitForm).toHaveBeenCalled();
		});
	});

	describe('Form submission - empty fields', () => {
		it('shows error messages to the user when the inputs are empty', async () => {
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(
				await screen.findByText('Please enter a card number', {
					selector: 'span',
				}),
			).toBeInTheDocument();
			expect(
				await screen.findByText('Please enter an expiry date', {
					selector: 'span',
				}),
			).toBeInTheDocument();
			expect(
				await screen.findByText('Please enter a CVC number', {
					selector: 'span',
				}),
			).toBeInTheDocument();
		});

		it('prevents form submission with empty inputs', async () => {
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).not.toHaveBeenCalled();
			expect(submitForm).not.toHaveBeenCalled();
		});
	});

	describe('Form submission - errors elsewhere in the form', () => {
		let errorProps: PropTypes;

		beforeEach(async () => {
			errorProps = {
				...props,
				setStripePaymentMethod,
				submitForm,
				validateForm,
				allErrors: [
					{
						field: 'firstName',
						message: 'Please fill out this field',
					},
				],
			};
			await fillOutForm();
		});

		it('shows the error summary if there are any errors in the form', async () => {
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...errorProps} />);
			});
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(
				await screen.findByText('Please fill out this field'),
			).toBeInTheDocument();
		});

		it('prevents form submission if there are errors elsewhere in the form', async () => {
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...errorProps} />);
			});
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).not.toHaveBeenCalled();
			expect(submitForm).not.toHaveBeenCalled();
		});

		it('allows submission once the errors are corrected', async () => {
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...errorProps} />);
			});
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(submitForm).not.toHaveBeenCalled();

			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...props} />);
			});
			await act(async () => void fireEvent.click(button));
			expect(submitForm).toHaveBeenCalled();
		});
	});
});
