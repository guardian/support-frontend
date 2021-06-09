// @flow
import React from 'react';
// styles
import { promotionTermsUrl } from 'helpers/urls/routes';
import { getPromotion } from 'helpers/productPrice/promotions';
import { connect } from 'react-redux';
import type { State } from 'pages/digital-subscription-landing/digitalSubscriptionLandingReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Annual, Monthly, Quarterly, type BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { Option } from 'helpers/types/option';
import Footer from './Footer';
import { footerTextHeading } from './footerStyles';

type PropTypes = {productPrices: ProductPrices, country: IsoCountry, orderIsAGift: boolean}

const mapStateToProps = (state: State) => ({
  country: state.common.internationalisation.countryId,
  productPrices: state.page.productPrices || state.page.checkout.productPrices,
});

const getPromoUrl = (
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
): Option<string> => {
  const promotion = getPromotion(
    productPrices,
    country,
    billingPeriod,
    NoFulfilmentOptions,
    NoProductOptions,
  );
  return promotion ? promotionTermsUrl(promotion.promoCode) : null;
};

type LinkTypes = {
  productPrices: ProductPrices,
  country: IsoCountry,
}

const MaybeLink = (props: {href: Option<string>, text: string}) =>
  (props.href ? <a href={props.href}>{props.text}</a> : null);

const RegularLinks = (props: LinkTypes) => {
  const annualUrl = getPromoUrl(props.productPrices, props.country, Annual);
  const monthlyUrl = getPromoUrl(props.productPrices, props.country, Monthly);
  const multipleOffers: boolean = !!(annualUrl && monthlyUrl);
  return (
    <span>
      <MaybeLink href={monthlyUrl} text="monthly" />{multipleOffers ? ' and ' : ''}
      <MaybeLink href={annualUrl} text="annual" />
      &nbsp;offer{multipleOffers ? 's' : ''}
    </span>
  );
};

const GiftLinks = (props: LinkTypes) => {
  const annualUrl = getPromoUrl(props.productPrices, props.country, Annual);
  const quarterlyUrl = getPromoUrl(props.productPrices, props.country, Quarterly);
  const multipleOffers: boolean = !!(annualUrl && quarterlyUrl);
  return (
    <span>
      <MaybeLink href={quarterlyUrl} text="quarterly" />{multipleOffers ? ' and ' : ''}
      <MaybeLink href={annualUrl} text="annual" />
      &nbsp;offer{multipleOffers ? 's' : ''}
    </span>
  );
};

function DigitalFooter(props: PropTypes) {
  const { orderIsAGift, country } = props;
  const faqsLink = orderIsAGift ? 'https://www.theguardian.com/help/2020/nov/23/guardian-gift-digital-subscription-faqs' :
    'https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions';
  const termsConditionsLink = orderIsAGift ?
    'https://www.theguardian.com/help/2020/nov/24/gift-digital-subscriptions-terms-and-conditions' :
    'https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions';
  return (
    <Footer
      faqsLink={faqsLink}
      termsConditionsLink={termsConditionsLink}
    >
      <h3
        id="qa-component-customer-service"
        css={footerTextHeading}
      >
          Promotion terms and conditions
      </h3>
      <p>Offer subject to availability. Guardian News and Media Ltd
          (&quot;GNM&quot;) reserves the right to withdraw this promotion at any
          time. Full promotion terms and conditions for our&nbsp;
        {orderIsAGift ?
          <GiftLinks productPrices={props.productPrices} country={country} /> :
          <RegularLinks productPrices={props.productPrices} country={country} />
          }.
      </p>
    </Footer>);
}

export default connect(mapStateToProps)(DigitalFooter);
