// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, currencies, spokenCurrencies, fromCountryGroupId } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  contributionType: Contrib,
  selectedAmounts: Array<{ value: string, spoken: string }>,
  paymentMethod: PaymentMethod,
};

// ----- Render ----- //

function ContributionSubmit(props: PropTypes) {
  const currency: IsoCurrency = fromCountryGroupId(props.countryGroupId) || 'GBP';

  return (
    <div className="form__submit">
      <button className="form__submit-button" type="submit">
        Contribute&nbsp;
        {formatAmount(currencies[currency], spokenCurrencies[currency], props.selectedAmounts[0], false)}&nbsp;
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

const NewContributionSubmit = connect()(ContributionSubmit);

export { NewContributionSubmit };
