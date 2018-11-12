// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SvgInfo from 'components/svgs/information';
import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ProductPageContentBlockOutset from 'components/productPage/productPageContentBlock/productPageContentBlockOutset';

import WeeklyCta from './weeklyCta';
import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPeriod, type Action } from '../weeklySubscriptionLandingActions';
import WeeklyFormLabel from './weeklyFormLabel';


// ---- Types ----- //

type PropTypes = {|
  selectedPeriod: WeeklyBillingPeriod | null,
  countryGroupId: CountryGroupId,
  redirectToWeeklyPageAction: () => void,
  setPeriodAction: (WeeklyBillingPeriod) => Action,
|};

// ----- Render ----- //

const WeeklyForm = ({
  selectedPeriod, countryGroupId, redirectToWeeklyPageAction, setPeriodAction,
}: PropTypes) => (
  <form
    className="weekly-form-wrap"
    onSubmit={(ev) => {
      ev.preventDefault();
      redirectToWeeklyPageAction();
    }}
  >
    <ProductPageContentBlockOutset>
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
              checked={type === selectedPeriod}
              onChange={() => { setPeriodAction(type); }}
            >
              {copy(countryGroupId)}
            </WeeklyFormLabel>
          </div>
          );
        })}
      </div>
    </ProductPageContentBlockOutset>

    <WeeklyCta disabled={selectedPeriod === null} type="submit">
      Subscribe now{selectedPeriod && ` – ${billingPeriods[selectedPeriod].title}`}
    </WeeklyCta>

    <div className="weekly-form__info">
      <SvgInfo />
      You can cancel your subscription at any time
    </div>
  </form>
);

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
