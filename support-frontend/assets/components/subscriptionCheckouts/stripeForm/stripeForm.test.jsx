import '__mocks__/stripeMock';

import { render, screen, act, fireEvent } from '@testing-library/react';
import { StripeProviderForCountry } from './stripeProviderForCountry';

describe('Stripe Form', () => {
  let props;
  let submitForm;
  let validateForm;

  beforeEach(async () => {
    submitForm = jest.fn();
    validateForm = jest.fn();

    props = {
      country: 'GB',
      isTestUser: true,
      allErrors: [],
      setStripePaymentMethod: jest.fn(),
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

  it('prevents double submission of the form while setting up the card payment', async () => {
    const button = await screen.findByRole('button');
    const action = act(async () => fireEvent.click(button));
    expect(button).toBeDisabled();
    await action;
    expect(button).not.toBeDisabled();
  });

  it('prevents form submission with empty inputs', async () => {
    const button = await screen.findByRole('button');
    await act(async () => fireEvent.click(button));
    expect(validateForm).toHaveBeenCalled();
    expect(submitForm).not.toHaveBeenCalled();
  });
});
