import '__mocks__/stripeMock';

import { render, screen, act } from '@testing-library/react';
import { StripeProviderForCountry } from './stripeProviderForCountry';

describe('Stripe Form', () => {
  let props;

  beforeEach(async () => {
    props = {
      country: 'GB',
      isTestUser: true,
      allErrors: [],
      setStripePaymentMethod: jest.fn(),
      submitForm: jest.fn(),
      validateForm: jest.fn(),
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

  it('should have labels', async () => {
    expect(await screen.findByText('Card number')).toBeInTheDocument();
  });
});
