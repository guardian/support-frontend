// @flow
import React from 'react';
// styles
import './digitalSubscriptionLanding.scss';
import { promotionTermsUrl } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';
import { promoQueryParam } from 'helpers/productPrice/promotions';
import { dpSale } from 'helpers/flashSale';

const TermsAndConditions = () => {
  const promoUrl = promotionTermsUrl(getQueryParameter(promoQueryParam) || dpSale.promoCode);
  return (
    <div className="hope-is-power__terms">
      <div className="hope-is-power--centered">
        <h3>Promotion terms and conditions</h3>
        <p>Offer subject to availability. Guardian News and Media Ltd
          (&quot;GNM&quot;) reserves the right to withdraw this promotion at any
          time. Full promotion <a href={promoUrl}>terms and conditions</a>.
        </p>
      </div>
    </div>);
};

export default TermsAndConditions;
