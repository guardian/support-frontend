// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { amounts, getFrequency, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, currencies, spokenCurrencies, detect } from 'helpers/internationalisation/currency';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  contributionType: Contrib,
  selectedAmounts: Array<{ value: string, spoken: string }>,
  paymentMethod: PaymentMethod,
};

const mapStateToProps = (state: State) =>
  ({
    contributionType: state.page.contributionType,
    paymentMethod: state.page.paymentMethod,
  });

// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {
  const currency: IsoCurrency = detect(props.countryGroupId);
  const selectedAmounts = amounts('notintest')[props.contributionType][props.countryGroupId];

  return (
    <div className="form__submit">
      <button className="form__submit-button" type="submit">
        Contribute&nbsp;
        {formatAmount(currencies[currency], spokenCurrencies[currency], selectedAmounts[0], false)}&nbsp;
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

const NewContributionSubmit = connect(mapStateToProps)(ContributionSubmit);

export { NewContributionSubmit };
