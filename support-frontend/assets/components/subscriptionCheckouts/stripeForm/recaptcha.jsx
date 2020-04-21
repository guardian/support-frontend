// @flow

import React from 'react';
import { withError } from 'hocs/withError';
import { contributionsTermsLinks, philanthropyContactEmail, privacyLink } from 'helpers/legal';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies, fromCountryGroupId } from 'helpers/internationalisation/currency';
import { campaigns } from 'helpers/campaigns';

function Recaptcha(props: PropTypes) {
  return (
    <>
      <div className="robot_checkbox"></div>
    </>
  );
}

export { Recaptcha }
