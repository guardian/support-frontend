// @flow

// ----- Imports ----- //

import { headline, body, textSans } from '@guardian/src-foundations/typography/obj';
import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import { config, type AmountsRegions, type Amount, type ContributionType, getAmount } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type IsoCurrency,
  currencies,
  spokenCurrencies,
  detect,
} from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { formatAmount } from 'helpers/checkouts';
import { selectAmount, open } from 'helpers/subscriptionsForms/formActions';
// import { type State } from '../contributionsLandingReducer';
import ContributionTextInputDs from './ContributionTextInputDs';
import ContributionAmountChoices from './ContributionAmountChoices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import SvgChevron from 'components/svgs/chevron';
import SvgCheckmark from 'components/svgs/checkmark';

// ----- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: ContributionType,
  amounts: AmountsRegions,
  selectedAmounts: SelectedAmounts,
  selectAmount: (Amount | 'other', CountryGroupId, ContributionType) => (() => void),
  open: () => (() => boolean),
  otherAmounts: OtherAmounts,
  checkOtherAmount: (string, CountryGroupId, ContributionType) => boolean,
  updateOtherAmount: (string, CountryGroupId, ContributionType) => void,
  // checkoutFormHasBeenSubmitted: boolean,
  // stripePaymentRequestButtonClicked: boolean,
  closed: boolean,
|};

const amounts = {
  GBPCountries: {
      MONTHLY: [
      {
        value: '11.99',
        isDefault: true
      },
      {
        value: '12.99'
      },
      {
        value: '15'
      },
      {
        value: '20'
      }
    ],
  },
};

const mapStateToProps = (state: CheckoutState) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.checkout.contributionType,
  amounts: amounts,
  selectedAmounts: state.page.checkout.selectedAmounts,
  otherAmounts: state.page.checkout.otherAmounts,
  closed: state.page.checkout.closed,
  // checkoutFormHasBeenSubmitted: state.page.checkout.formData.checkoutFormHasBeenSubmitted,
  // stripePaymentRequestButtonClicked:
  //   state.page.form.stripePaymentRequestButtonData.ONE_OFF.stripePaymentRequestButtonClicked ||
  //   state.page.form.stripePaymentRequestButtonData.REGULAR.stripePaymentRequestButtonClicked,
});

const mapDispatchToProps = (dispatch: Function) => ({
  selectAmount: (amount, countryGroupId, contributionType) => () => {
    dispatch(selectAmount(amount, contributionType));
  },
  open: () => () => {
    dispatch(open());
    return false;
  },
  // updateOtherAmount: (amount, countryGroupId, contributionType) => {
  //   dispatch(updateOtherAmount(amount, contributionType));
  // },
});

const renderEmptyAmount = (id: string) => (
  <li className="form__radio-group-item amounts__placeholder">
    <input
      id={`contributionAmount-${id}`}
      className="form__radio-group-input"
      type="radio"
      name="contributionAmount"
    />
    <label htmlFor={`contributionAmount-${id}`} className="form__radio-group-label">&nbsp;</label>
  </li>
);

const amountFormatted = (amount: number, currencyString: string, countryGroupId: CountryGroupId) => {
  if (amount < 1 && countryGroupId === 'GBPCountries') {
    return `${(amount * 100).toFixed(0)}p`;
  }
  return `${currencyString}${(amount).toFixed(2)}`;
};

const expanderCss = css`
  div {
    ${textSans.medium({ fontWeight: 'normal' })};
    margin-bottom: 1.5em;
    .svg-chevron {
  width: 22px;
  height: 13px;
  fill: #000;
  margin-left: 0.5em;
}
  }
`;

const whyCss = css`
  {
    ${textSans.medium({ fontWeight: 'normal' })};
    margin-bottom: 1em;
  }
`;

const checkmark = css`
    {
    margin-bottom: 0.5em;
  margin-left: 0;
  margin-top: 2em;
    .svg-checkmark {
  width: 18px;
  height: 18px;
  fill: #000;
  margin-left: 0.5em;
  margin-right: 0.5em;
}
}
`;

const lightBlue = css`
  {
    background-color: #f1f5fd;
    border-top: 1px solid #DCDCDC;
    border-bottom: 1px solid #DCDCDC;
  }
`;

function withProps(props: PropTypes) {
  const validAmounts: Amount[] = props.amounts[props.countryGroupId][props.contributionType];
  const showOther: boolean = props.selectedAmounts[props.contributionType] === 'other';
  const { min, max } = config[props.countryGroupId][props.contributionType]; // eslint-disable-line react/prop-types
  const minAmount: string =
    formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: min.toString() }, false);
  const maxAmount: string =
    formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: max.toString() }, false);
  const otherAmount = props.otherAmounts[props.contributionType].amount;
  const otherLabelSymbol: string = currencies[props.currency].glyph;
  const {
    checkOtherAmount,
    closed,
  } = props;
  const updateAmount = props.updateOtherAmount;

  const showWeeklyBreakdown =
    props.contributionType !== 'ONE_OFF';

  const renderOtherField = () => (
    <ContributionTextInputDs
      id="contributionOther"
      name="contribution-other-amount"
      type="number"
      label={`Other amount (${otherLabelSymbol})`}
      value={otherAmount}
      onInput={e => updateAmount(
      (e.target: any).value,
      props.countryGroupId,
      props.contributionType,
    )}
      isValid={checkOtherAmount(otherAmount || '', props.countryGroupId, props.contributionType)}
      formHasBeenSubmitted={false}
      errorMessage={`Please provide an amount between ${minAmount} and ${maxAmount}`}
      autoComplete="off"
      step={0.01}
      min={min}
      max={max}
      autoFocus
      required
    />
  );

  return (
    <div css={lightBlue} >
      <div className={classNameWithModifiers('component-checkout-form-section', ['full', 'wrap'])} >
      <h2 className={classNameWithModifiers('component-checkout-form-section__heading', [])}>Want to increase your support?</h2>
        <div css={whyCss}>
          We know that many people prefer to pay more in order to show a higher level of support.
        </div>
      <div css={expanderCss}>
      {(closed) ?
        (<div css={css`cursor: pointer;`} onClick={props.open()}>How your support helps
          <span className="icon icon--arrows"><SvgChevron /></span></div>) :
        (<div>Your funding powers our journalism, it protects our independence, and ensures we can remain open for all. You can further support us through these
          challenging economic times and enable real-world impact. Every extra contribution, however big or small, makes a real difference for our
          future.</div>)
      }
      </div>
      <ContributionAmountChoices
        countryGroupId={props.countryGroupId}
        currency={props.currency}
        contributionType={props.contributionType}
        validAmounts={validAmounts}
        showOther={showOther}
        selectedAmounts={props.selectedAmounts}
        selectAmount={props.selectAmount}
        shouldShowFrequencyButtons={props.contributionType !== 'ONE_OFF'}
      />

        {(parseFloat(props.selectedAmounts['MONTHLY'].value) > 11.99) ?
          (<div css={checkmark}>
            <span className="icon icon--arrows"><SvgCheckmark /></span>
            Thank you for your contribution
          </div>) :
          (null)
        }

    </div>
    </div>
  );
}

function withoutProps() {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['pills', 'contribution-amount'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>How much would you like to give?</legend>
      <ul className="form__radio-group-list">
        {
          ['a', 'b', 'c', 'd'].map(renderEmptyAmount)
        }
      </ul>
    </fieldset>
  );
}

export const ContributionAmount = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const EmptyContributionAmount = withoutProps;
