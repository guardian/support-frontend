// @flow
import React from 'react';

// styles
import './digitalSubscriptionLanding.scss';
import { promotionTermsUrl } from 'helpers/externalLinks';

const TermsAndConditions = () => (
  <div className="hope-is-power__terms">
    <div className="hope-is-power--centered">
      <h3>Promotion terms and conditions</h3>
      <p>Offer subject to availability. Guardian News and Media Ltd (&quot;GNM&quot;) reserves the right to withdraw this promotion at any time. Full promotion <a href={promotionTermsUrl('DK0NT24WG')}>terms and conditions</a>.</p>
    </div>
  </div>
);

export default TermsAndConditions;
