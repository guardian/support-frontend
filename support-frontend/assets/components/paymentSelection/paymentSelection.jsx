// @flow

import React from 'react';
import { connect } from 'react-redux';

// components
import ProductOption, {
  ProductOptionContent,
  ProductOptionTitle,
  ProductOptionPrice,
  ProductOptionCopy,
  ProductOptionOffer,
  ProductOptionButton,
} from 'components/productOption/productOption';

// styles
import './paymentSelection.scss';

// helpers
import { getDigitalCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

// lookups
const CURRENCY_SYMBOLS = {
  USD: '$',
  GBP: '£',
};

const COUNRTY_GROUPS = {
  GBPCountries: 'United Kingdom',
  International: 'International',
};

const BILLING_PERIOD = {
  Monthly: {
    title: 'Monthly',
    singlePeriod: 'month',
  },
  Annual: {
    title: 'Annually',
    singlePeriod: 'year',
  },
};

// state
const mapStateToProps = (state) => {
  const { productPrices } = state.page;
  const { countryGroupId, currencyId } = state.common.internationalisation;
  console.log({ currencyId });

  /*
   * NoFulfilmentOptions - means there this nothing to be delivered
   * NoProductOptions ? - means there is only one product to choose
   */
  const productOptions = productPrices[COUNRTY_GROUPS[countryGroupId]].NoFulfilmentOptions.NoProductOptions;
  const paymentOptions = Object.keys(productOptions).map(productTitle => ({
    ...BILLING_PERIOD[productTitle],
    price: CURRENCY_SYMBOLS[currencyId] + productOptions[productTitle][currencyId].price.toFixed(2),
    href: getDigitalCheckout(countryGroupId, productTitle),
    onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, productTitle),
  }));
  return {
    paymentOptions,
  };
};

const PaymentSelection = ({ paymentOptions }) => {
  console.log(paymentOptions);

  return (
    <div className="payment-selection">
      {paymentOptions.map(paymentOption => (
        <div className="payment-selection__card">
          <ProductOption
            href={paymentOption.href}
            onClick={paymentOption.onClick}
          >
            <ProductOptionContent>
              <ProductOptionTitle>{paymentOption.title}</ProductOptionTitle>
              <ProductOptionPrice>
                {paymentOption.price}&nbsp;
                <ProductOptionCopy>/{paymentOption.singlePeriod}</ProductOptionCopy>
              </ProductOptionPrice>
              <ProductOptionOffer>Save 22% a month on <br />&nbsp;retail price</ProductOptionOffer>
            </ProductOptionContent>
            <ProductOptionButton
              href={paymentOption.href}
              onClick={paymentOption.onClick}
              aria-label="Subscribe-button"
            >
              Subscribe now
            </ProductOptionButton>
          </ProductOption>
        </div>
      ))}
    </div>
  );
};

export default connect(mapStateToProps)(PaymentSelection);
