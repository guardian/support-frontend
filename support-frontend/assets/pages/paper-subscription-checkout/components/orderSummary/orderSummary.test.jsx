/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PaperOrderSummary from './orderSummary';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import GridImage from 'components/gridImage/gridImage';

function mockPaperCheckoutReducer() {
  return originalState => originalState;
}

function renderWithStore(
  component,
  {
    initialState,
    store = createStore(mockPaperCheckoutReducer, initialState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(component, { wrapper: Wrapper, ...renderOptions });
}

describe('Paper order summary', () => {
  let props;
  let initialState;

  beforeEach(() => {
    initialState = {
      product: 'Paper',
      startDate: 'today',
      productPrices: [],
      productOption: 'meep',
      fulfilmentOption: 'beep',
    };

    props = {
      image: <GridImage
        gridId="printCampaignHDdigitalVoucher"
        srcSizes={[500]}
        sizes="(max-width: 740px) 50vw, 696"
        imgType="png"
        altText=""
      />,
      includesDigiSub: true,
      changeSubscription: '/page',
    };

    renderWithStore(<PaperOrderSummary {...props} />, { initialState });
  });

  it('contains a link to return to the relevant product page', async () => {
    expect(await screen.findByText('Change')).toHaveAttribute('href', '/page');
  });

  it('displays a secpmd product when the digital subscription is included', async () => {
    expect(await screen.findByText('Digital subscription')).toBeInTheDocument();
  });
});
