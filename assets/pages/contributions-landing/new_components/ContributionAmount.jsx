import React from 'react';
import { connect } from 'react-redux';

import { amounts, type Amount } from 'helpers/contributions'; 

const formatAmount = (countryGroupDetails: CountryMetaData, amount: Amount, verbose: boolean) => (verbose ?
  `${amount.value} ${countryGroupDetails.currency.name}` :
  `${countryGroupDetails.currency.symbol}${amount.value}`);

const renderAmount = (countryGroupDetails: CountryMetaData) => (amount: Amount, i) => (
  <li className="form__radio-group__item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group__input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      checked={i === 0}
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group__label" aria-label={formatAmount(countryGroupDetails, amount, true)}>
      {formatAmount(countryGroupDetails, amount, false)}
    </label>
  </li>
);


function ContributionAmount(props) {
  return (
    <fieldset className="form__radio-group form__radio-group--pills form__radio-group--contribution-amount">
      <legend className="form__legend form__legend--radio-group">Amount</legend>
      <ul className="form__radio-group__list">
        {amounts('notintest')[props.contributionType][props.countryGroupId].map(renderAmount(props.countryGroupDetails))}
        <li className="form__radio-group__item">
          <input id="contributionAmount-other" 
            className="form__radio-group__input" 
            type="radio" 
            name="contributionAmount" 
            value="other" 
            checked={props.amount === 'other'} 
            />
          <label htmlFor="contributionAmount-other" className="form__radio-group__label">Other</label>
        </li>
      </ul>
      {props.amount === 'other' ? (
        <div className="form__field form__field--contribution-other-amount">
          <label className="form__label" htmlFor="contributionOther">Other Amount</label>
          <span className="form__input-with-icon">
            <input id="contributionOther" 
              className="form__input" 
              type="number" 
              min="1" 
              max="2000" 
              autoComplete="off" 
              value={props.otherAmount} 
              />
            <span className="form__icon">
              <svg width="11" height="19" xmlns="http://www.w3.org/2000/svg"><path d="M2.9 18.992l.365-2.676c-1.176-.08-2.292-.304-3.062-.648L0 12.06h1.724l.77 2.676c.284.141.629.243.994.304l.588-4.48-.629-.263C1.297 9.405.122 8.047.122 5.919c0-2.412 1.44-4.297 5.07-4.358L5.393 0h1.359l-.224 1.601a10.19 10.19 0 0 1 2.657.548l.203 3.445H7.766l-.73-2.493a2.784 2.784 0 0 0-.77-.203l-.527 4.075.608.243c2.291.932 3.873 1.925 3.873 4.5 0 2.979-2.109 4.661-5.637 4.661l-.345 2.615H2.9zm.243-14.31c0 .912.406 1.378 1.46 1.845l.487-3.69c-1.278.082-1.947.77-1.947 1.845zm3.812 8.412c0-1.095-.547-1.54-1.764-2.047L4.664 15.1c1.52-.101 2.291-.85 2.291-2.006z" /><path d="M-14-12h38v42h-38z" fill="none" /></svg>
            </span>
          </span>
        </div>
      ) : null}
    </fieldset>
  );
}


const s2p = state => ({ 
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.common.newPaymentUI.contributionType,
  amount: state.common.newPaymentUI.amount,
  otherAmount: state.common.newPaymentUI.otherAmount
});

const NewContributionAmount = connect(s2p)(ContributionAmount);

export { formatAmount, NewContributionAmount };