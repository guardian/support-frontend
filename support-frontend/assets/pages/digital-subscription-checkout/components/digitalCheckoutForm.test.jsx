/* eslint-disable react/prop-types */
import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { digitalProducts } from '__mocks__/productInfoMocks';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createCommonReducer } from 'helpers/page/commonReducer';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import DigitalCheckoutForm from './digitalCheckoutForm';

const pageReducer = commonState => createCheckoutReducer(
  commonState.internationalisation.countryId,
  DigitalPack,
  '',
  null, null, null,
);

function setUpStore(initialState) {
  return createStore(
    combineReducers({ page: pageReducer(initialState.common), common: createCommonReducer(initialState.common) }),
    initialState,
  );
}

function renderWithStore(
  component,
  {
    initialState,
    store = setUpStore(initialState),
    ...renderOptions
  } = {},
) {

  console.log(store.getState());
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(component, { wrapper: Wrapper, ...renderOptions });
}

describe('Digital checkout form', () => {
  // Suppress warnings related to our version of Redux and improper JSX
  console.warn = jest.fn();
  console.error = jest.fn();

  let initialState;

  beforeEach(() => {
    initialState = {
      page: {
        checkout: {
          product: 'DigitalPack',
          billingPeriod: 'Monthly',
          productOption: 'NoProductOptions',
          fulfilmentOption: 'NoFulfilmentOptions',
          productPrices: digitalProducts,
          formErrors: [],
        },
      },
      common: {
        internationalisation: {
          countryGroupId: 'GBPCountries',
          countryId: 'GB',
          currencyId: 'GBP',
        },
      },
    };

    renderWithStore(<DigitalCheckoutForm />, { initialState });
  });

  describe('Payment methods', () => {
    it('shows the direct debit option when the currency is GBP and the billing address is in the UK', async () => {
      expect(await screen.findByText('Direct debit')).toBeInTheDocument();

    });
  });
});
