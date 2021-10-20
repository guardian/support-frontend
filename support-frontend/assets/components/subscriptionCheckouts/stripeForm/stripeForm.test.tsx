// eslint-disable-next-line import/no-unresolved
import '__mocks__/stripeMock';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { StripeProviderForCountry } from './stripeProviderForCountry';

async function fillOutForm() {
	const cardNumber = await screen.findByLabelText('Card number');
	const expiry = await screen.findByLabelText('Expiry date');
	const cvc = await screen.findByLabelText('CVC');
	await act(async () =>
		fireEvent.change(cardNumber, {
			target: {
				value: '4242424242424242',
			},
		}),
	);
	await act(async () =>
		fireEvent.change(expiry, {
			target: {
				value: '0230',
			},
		}),
	);
	await act(async () =>
		fireEvent.change(cvc, {
			target: {
				value: '123',
			},
		}),
	);
}

describe('Stripe Form', () => {
	let props;
	let stripeForm;
	let submitForm;
	let validateForm;
	let setStripePaymentMethod;
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
			await act(async () => fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).toHaveBeenCalled();
			expect(submitForm).toHaveBeenCalled();
		});
	});
	describe('Form submission - empty fields', () => {
		it('shows error messages to the user when the inputs are empty', async () => {
			const button = await screen.findByRole('button');
			await act(async () => fireEvent.click(button));
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
			await act(async () => fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).not.toHaveBeenCalled();
			expect(submitForm).not.toHaveBeenCalled();
		});
	});
	describe('Form submission - errors elsewhere in the form', () => {
		let errorProps;
		beforeEach(async () => {
			errorProps = {
				...props,
				setStripePaymentMethod,
				submitForm,
				validateForm,
				allErrors: [
					{
						field: 'postCode',
						message: 'Please enter a billing postcode',
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
			await act(async () => fireEvent.click(button));
			expect(
				await screen.findByText('Please enter a billing postcode'),
			).toBeInTheDocument();
		});
		it('prevents form submission if there are errors elsewhere in the form', async () => {
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...errorProps} />);
			});
			const button = await screen.findByRole('button');
			await act(async () => fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(setStripePaymentMethod).not.toHaveBeenCalled();
			expect(submitForm).not.toHaveBeenCalled();
		});
		it('allows submission once the errors are corrected', async () => {
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...errorProps} />);
			});
			const button = await screen.findByRole('button');
			await act(async () => fireEvent.click(button));
			expect(submitForm).not.toHaveBeenCalled();
			await act(async () => {
				stripeForm.rerender(<StripeProviderForCountry {...props} />);
			});
			await act(async () => fireEvent.click(button));
			expect(submitForm).toHaveBeenCalled();
		});
	});
});
