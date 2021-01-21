import '__mocks__/stripeMock';

import { render, screen } from '@testing-library/react';
import { StripeProviderForCountry } from './stripeProviderForCountry';

describe('Stripe Form', () => {
  let props;

  beforeEach(() => {
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

    render(<StripeProviderForCountry {...props} />);
  });

  it('should have labels', async () => {
    expect(await screen.findByText('Card number')).toBeInTheDocument();
  });
});
