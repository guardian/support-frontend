// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SvgInfo from 'components/svgs/information';
import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import WeeklyCta from './weeklyCta';
import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, type Action } from '../weeklySubscriptionLandingActions';
import WeeklyFormLabel from './weeklyFormLabel';


// ---- Types ----- //

type PropTypes = {|
  checked: WeeklyBillingPeriod | null,
  countryGroupId: CountryGroupId,
  redirectToWeeklyPageAction: () => void,
|};

// ----- Render ----- //

const WeeklyForm = ({
  checked, countryGroupId, redirectToWeeklyPageAction,
}: PropTypes) => (
  <form
    className="weekly-form-wrap"
    onSubmit={(ev) => {
    ev.preventDefault();
    redirectToWeeklyPageAction();
    }}
  >
    <div className="weekly-form">
      {Object.keys(billingPeriods).map((type: WeeklyBillingPeriod) => {
        const {
          copy, title,
        } = billingPeriods[type];
        return (
          <div className="weekly-form__item">
            <WeeklyFormLabel
              title={title}
              offer={billingPeriods[type].offer || null}
              type={type}
              key={type}
            >
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
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  checked: state.page.period,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  redirectToWeeklyPageAction: bindActionCreators(redirectToWeeklyPage, dispatch),
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyForm);
