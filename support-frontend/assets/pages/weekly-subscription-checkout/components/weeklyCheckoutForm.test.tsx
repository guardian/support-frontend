import '__mocks__/stripeMock';
import { fireEvent, screen } from '@testing-library/react';
import { mockFetch } from '__mocks__/fetchMock';
import { weeklyProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import {
  setBillingCountry,
  setDeliveryCountry,
} from 'helpers/redux/checkout/address/actions';
import { setProductPrices } from 'helpers/redux/checkout/product/actions';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { setFirstName } from 'pages/contributions-landing/contributionsLandingActions';
import { getWeeklyFulfilmentOption } from '../../../helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from '../../../helpers/productPrice/productOptions';
import type { SubscriptionsStore } from '../../../helpers/redux/subscriptionsStore';
import { initReduxForSubscriptions } from '../../../helpers/redux/subscriptionsStore';
import { formatMachineDate } from '../../../helpers/utilities/dateConversions';
import WeeklyCheckoutForm from './weeklyCheckoutForm';
import { isSwitchOn } from '../../../helpers/globalsAndSwitches/globals';

function setUpStore(initialState: WithDeliveryCheckoutState) {
  const store = initReduxForSubscriptions(
    GuardianWeekly,
    'Monthly',
    formatMachineDate(new Date()),
    NoProductOptions,
    getWeeklyFulfilmentOption,
  );
  store.dispatch(setProductPrices(weeklyProducts));
  store.dispatch(setInitialCommonState(initialState.common));
  return store;
}

jest.mock('helpers/globalsAndSwitches/globals', () => {
  const actualGlobalsAndSwitches = jest.requireActual('helpers/globalsAndSwitches/globals');

  return {
    ...actualGlobalsAndSwitches,
    isSwitchOn: jest.fn(),
  }
});
const mock = (mockFn: unknown) => mockFn as jest.Mock;

describe('Guardian Weekly checkout form', () => {
  // Suppress warnings related to our version of Redux and improper JSX
  console.warn = jest.fn();
  console.error = jest.fn();
  let initialState: unknown;
  let store: SubscriptionsStore;
  const [billingPeriod, productOption, fulfilmentOption] = [
    'Monthly',
    'NoProductOptions',
    'Domestic',
  ];

  beforeEach(() => {
    mock(isSwitchOn).mockImplementation(() => true);

    initialState = {
      page: {
        checkout: {
          formErrors: [],
          billingAddressIsSame: true,
        },
        checkoutForm: {
          product: {
            productType: GuardianWeekly,
            billingPeriod,
            productOption,
            fulfilmentOption,
            productPrices: weeklyProducts,
          },
          billingAddress: {
            fields: {
              country: 'GB',
              errors: [],
            },
          },
          deliveryAddress: {
            fields: {
              country: 'GB',
              errors: [],
            },
          },
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

    mockFetch({
      client_secret: 'super secret',
    });

    // @ts-expect-error -- Type mismatch is unimportant for tests
    store = setUpStore(initialState);

    renderWithStore(<WeeklyCheckoutForm />, {
      initialState,
      store,
    });
  });

  afterEach(() => {
    // TODO: Set up a non-global store for tests
    store.dispatch(setFirstName(''));
    store.dispatch(setDeliveryCountry('GB'));
    store.dispatch(setBillingCountry('GB'));
  });

  describe('Payment methods', () => {
    it('shows the direct debit option when the currency is GBP and the delivery address is in the UK', () => {
      expect(screen.queryByText('Direct debit')).toBeInTheDocument();
    });

    it('does not show the direct debit option when the delivery address is outside the UK', async () => {
      const countrySelect = await screen.findByLabelText('Country');
      fireEvent.change(countrySelect, {
        target: {
          value: 'DE',
        },
      });
      expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
    });

    it('does not show the direct debit option when the billing address is outside the UK', async () => {
      const addressIsNotSame = await screen.findByRole('radio', {
        name: 'No',
      });
      fireEvent.click(addressIsNotSame);
      const allCountrySelects = await screen.findAllByLabelText('Country');
      fireEvent.change(allCountrySelects[1], {
        target: {
          value: 'IE',
        },
      });
      expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should display an error if a silly character is entered into an input field', async () => {
      const firstNameInput = await screen.findByLabelText('First name');
      fireEvent.change(firstNameInput, {
        target: {
          value: 'jane✅',
        },
      });
      const creditDebit = await screen.findByLabelText('Credit/Debit card');
      fireEvent.click(creditDebit);
      const payNowButton = await screen.findByRole(
        'button',
        {
          name: 'Pay now',
        },
        {
          timeout: 2000,
        },
      );
      fireEvent.click(payNowButton);
      expect(
        screen.queryAllByText(
          'Please use only letters, numbers and punctuation.',
        ).length,
      ).toBeGreaterThan(0);
    });

    it('should not display an error message when only valid characters are entered', async () => {
      const firstNameInput = await screen.findByLabelText('First name');
      fireEvent.change(firstNameInput, {
        target: {
          // This is a right single quotation character, *not* an apostrophe
          value: 'O’Connor',
        },
      });
      const creditDebit = await screen.findByLabelText('Credit/Debit card');
      fireEvent.click(creditDebit);
      const payNowButton = await screen.findByRole(
        'button',
        {
          name: 'Pay now',
        },
        {
          timeout: 2000,
        },
      );
      fireEvent.click(payNowButton);
      expect(
        screen.queryAllByText(
          'Please use only letters, numbers and punctuation.',
        ),
      ).toHaveLength(0);
    });
  });

  describe('Pricing internationalisation', () => {
    it('should display correct prices based on delivery address country (regardless of billing address country)', async () => {
      const addressIsNotSame = await screen.findByRole('radio', {
        name: 'No',
      });
      fireEvent.click(addressIsNotSame);

      const [Germany, UnitedKingdom] = ['DE', 'GB'];
      const [deliveryAddressCountry, billingAddressCountry] =
        await screen.findAllByLabelText('Country');
      fireEvent.change(deliveryAddressCountry, {
        target: {
          value: Germany,
        },
      });
      fireEvent.change(billingAddressCountry, {
        target: {
          value: UnitedKingdom,
        },
      });

      const expectedPrice =
        // @ts-expect-error -- `weeklyProducts` is a hard-coded mock, type checking is irrelevant
        weeklyProducts['Europe'][fulfilmentOption][productOption][
          billingPeriod
          ]['EUR']['price'];
      expect(
        screen.queryAllByText(new RegExp(`€${expectedPrice}.+per month`))
          .length,
      ).toBeGreaterThan(0);
    });
  });
});
