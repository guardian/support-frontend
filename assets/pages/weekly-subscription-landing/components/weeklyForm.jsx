// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import SvgInfo from 'components/svgs/information';
import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import WeeklyCta from './weeklyCta';
import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import WeeklyFormLabel from './weeklyFormLabel';


// ---- Types ----- //

type PropTypes = {|
  checked?: ?WeeklyBillingPeriod,
  url?: ?string,
  countryGroupId: CountryGroupId
|};

// ----- Render ----- //

const onSubmit = (ev: Event, url: ?string) => {
  ev.preventDefault();
  if (url) { window.location.href = url; }
};

const WeeklyForm = ({ checked, url, countryGroupId }: PropTypes) => (
  <form className="weekly-form-wrap" onSubmit={(ev) => { onSubmit(ev, url); }}>
    <div className="weekly-form">
      {Object.keys(billingPeriods).map((type: WeeklyBillingPeriod) => {
        const {
          offer, copy, title,
        } = billingPeriods[type];
        return (
          <div className="weekly-form__item">
            <WeeklyFormLabel title={title} offer={offer} type={type} key={type}>
              {copy(countryGroupId)}
            </WeeklyFormLabel>
          </div>
          );
        })}
    </div>

    <WeeklyCta disabled={checked === null} type="submit">
      Subscribe now{checked && ` – ${billingPeriods[checked].title}`}
    </WeeklyCta>

    <div className="weekly-form__info">
      <SvgInfo />
      You can cancel your subscription at any time
    </div>
  </form>
);

WeeklyForm.defaultProps = {
  checked: null,
  url: null,
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => {
  const { countryGroupId } = state.common.internationalisation;
  const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
  return {
    checked: state.page.period,
    countryGroupId,
    url: state.page.period ? getWeeklyCheckout(
      referrerAcquisitionData,
      state.page.period,
      countryGroupId,
      abParticipations,
      optimizeExperiments,
    ) : null,
  };
};

// ----- Exports ----- //

export default connect(mapStateToProps)(WeeklyForm);
