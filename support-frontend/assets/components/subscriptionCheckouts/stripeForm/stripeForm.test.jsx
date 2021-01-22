// eslint-disable-next-line import/no-unresolved
import '__mocks__/stripeMock';

import { render, screen, act, fireEvent } from '@testing-library/react';
import { StripeProviderForCountry } from './stripeProviderForCountry';

describe('Stripe Form', () => {
  let props;
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
      json: async () => ({ client_secret: 'super secret' }),
    });

    // Async render as StripeForm does a bunch of internal async set up
    await act(async () => {
      render(<StripeProviderForCountry {...props} />);
    });
  });

  describe('Form submission - valid form data', () => {
    beforeEach(async () => {
      const cardNumber = await screen.findByLabelText('Card number');
      const expiry = await screen.findByLabelText('Expiry date');
      const cvc = await screen.findByLabelText('CVC');
      await act(async () => fireEvent.change(cardNumber, { target: { value: '4242424242424242' } }));
      await act(async () => fireEvent.change(expiry, { target: { value: '0230' } }));
      await act(async () => fireEvent.change(cvc, { target: { value: '123' } }));
    });

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
      expect(await screen.findByText('Please enter a card number', { selector: 'span' })).toBeInTheDocument();
      expect(await screen.findByText('Please enter an expiry date', { selector: 'span' })).toBeInTheDocument();
      expect(await screen.findByText('Please enter a CVC number', { selector: 'span' })).toBeInTheDocument();
    });

    it('prevents form submission with empty inputs', async () => {
      const button = await screen.findByRole('button');
      await act(async () => fireEvent.click(button));
      expect(validateForm).toHaveBeenCalled();
      expect(setStripePaymentMethod).not.toHaveBeenCalled();
      expect(submitForm).not.toHaveBeenCalled();
    });
  });
});
