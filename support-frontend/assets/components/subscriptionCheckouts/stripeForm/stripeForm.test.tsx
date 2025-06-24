/* eslint-disable @typescript-eslint/require-await -- To simplify mocking of functions that return promises */
import '__mocks__/settingsMock';
import '__mocks__/stripeMock';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { mockFetch } from '__mocks__/fetchMock';
import { renderWithStore } from '__test-utils__/render';
import { createTestStoreForSubscriptions } from '__test-utils__/testStore';
import { setStripePaymentMethod } from 'helpers/redux/checkout/payment/stripe/actions';
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
	// The action object that would be dispatched on a successful payment creation with the Stripe mock
	const mockPaymentMethodAction = setStripePaymentMethod('mock');

	let props: PropTypes;
	let stripeForm: RenderResult;
	let store: ReturnType<typeof createTestStoreForSubscriptions>;
	let submitForm: () => void;
	let validateForm: () => void;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- dont care if the function is called
	const setStripePublicKey: (key: string) => void = (_ignored: string) =>
		void 0;

	beforeEach(async () => {
		submitForm = jest.fn();
		validateForm = jest.fn();
		props = {
			country: 'GB',
			currency: 'GBP',
			isTestUser: true,
			allErrors: [],
			submitForm,
			validateForm,
			buttonText: 'Button',
			csrf: {
				token: 'mock token',
			},
			setStripePublicKey,
		};

		mockFetch({
			client_secret: 'super secret',
		});

		store = createTestStoreForSubscriptions(
			'GuardianWeekly',
			BillingPeriod.Monthly,
			'2022-09-01',
		);

		jest.spyOn(store, 'dispatch');

		// Async render as StripeForm does a bunch of internal async set up
		await act(async () => {
			stripeForm = renderWithStore(<StripeProviderForCountry {...props} />, {
				store,
			});
		});
	});

	describe('Form submission - valid form data', () => {
		beforeEach(fillOutForm);
		it('allows submission when form input is valid', async () => {
			const button = await screen.findByRole('button');
			await act(async () => void fireEvent.click(button));
			expect(validateForm).toHaveBeenCalled();
			expect(store.dispatch).toHaveBeenCalledWith(mockPaymentMethodAction);
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
			expect(store.dispatch).not.toHaveBeenCalledWith(mockPaymentMethodAction);
			expect(submitForm).not.toHaveBeenCalled();
		});
	});

	describe('Form submission - errors elsewhere in the form', () => {
		let errorProps: PropTypes;

		beforeEach(async () => {
			errorProps = {
				...props,
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
			expect(store.dispatch).not.toHaveBeenCalledWith(mockPaymentMethodAction);
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
