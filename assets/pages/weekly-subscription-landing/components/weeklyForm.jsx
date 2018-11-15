// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SvgInfo from 'components/svgs/information';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { outsetClassName, bgClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';

import WeeklyCta from './weeklyCta';
import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPeriod, type Action } from '../weeklySubscriptionLandingActions';
import WeeklyFormLabel from './weeklyFormLabel';


// ---- Types ----- //

type PropTypes = {|
  selectedPeriod: string | null,
  countryGroupId: CountryGroupId,
  redirectToWeeklyPageAction: () => void,
  setPeriodAction: (string) => Action,
|};

// ----- Render ----- //

function WeeklyForm({
  selectedPeriod, countryGroupId, redirectToWeeklyPageAction, setPeriodAction,
}: PropTypes) {
  return (
    <form
      className="weekly-form-wrap"
      onSubmit={(ev) => {
      ev.preventDefault();
      redirectToWeeklyPageAction();
    }}
    >
      <div className={outsetClassName}>
        <div className="weekly-form">
          {Object.keys(billingPeriods).map((type) => {
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
              checked={type === selectedPeriod}
              onChange={() => { setPeriodAction(type); }}
            >
              {copy(countryGroupId)}
            </WeeklyFormLabel>
          </div>
          );
        })}
        </div>
      </div>
      <div className={['weekly-form__cta', bgClassName].join(' ')} data-disabled={selectedPeriod === null}>
        <WeeklyCta disabled={selectedPeriod === null} type="submit">
        Subscribe now{selectedPeriod && ` – ${billingPeriods[selectedPeriod].title}`}
        </WeeklyCta>
      </div>

      <div className="weekly-form__info">
        <SvgInfo />
      You can cancel your subscription at any time
      </div>
    </form>
  );
}

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedPeriod: state.page.period,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  redirectToWeeklyPageAction: bindActionCreators(redirectToWeeklyPage, dispatch),
  setPeriodAction: bindActionCreators(setPeriod, dispatch),
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyForm);
