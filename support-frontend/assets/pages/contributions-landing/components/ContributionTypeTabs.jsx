/* eslint-disable react/no-unused-prop-types */
// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import {
  getPaymentMethodToSelect,
  toHumanReadableContributionType,
} from 'helpers/forms/checkouts';

import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type State } from '../contributionsLandingReducer';
import { updateContributionTypeAndPaymentMethod } from '../contributionsLandingActions';
import type {
  ContributionTypes,
  ContributionTypeSetting,
} from 'helpers/contributions';
import { ChoiceCardGroup, ChoiceCard } from '@guardian/src-choice-card';
import { setCurrencyId, setUseLocalAmounts } from '../../../helpers/page/commonActions';

// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  switches: Switches,
  contributionTypes: ContributionTypes,
  onSelectContributionType: (ContributionType, Switches, IsoCountry, CountryGroupId, boolean) => void,
  useLocalCurrency: boolean,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
  contributionTypes: state.common.settings.contributionTypes,
  useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onSelectContributionType: (
    contributionType: ContributionType,
    switches: Switches,
    countryId: IsoCountry,
    countryGroupId: CountryGroupId,
    useLocalCurrency: boolean,
  ) => {
    const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId, countryGroupId);
    trackComponentClick(`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`);
    dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethodToSelect));
    if (contributionType !== 'ONE_OFF') {
      dispatch(setCurrencyId(false));
      dispatch(setUseLocalAmounts(false));
    } else {
      dispatch(setCurrencyId(useLocalCurrency));
      dispatch(setUseLocalAmounts(useLocalCurrency));
    }
  },
});

// ----- Render ----- //

function withProps(props: PropTypes) {
  const contributionTypes = props.contributionTypes[props.countryGroupId];

  const renderChoiceCards = () => (
    <ChoiceCardGroup
      name="contributionTypes"
      orientation="horizontal"
    >
      {contributionTypes.map((contributionTypeSetting: ContributionTypeSetting) => {
      const { contributionType } = contributionTypeSetting;
      return (
        <ChoiceCard
          id={`contributionType-${contributionType}`}
          value={contributionType}
          label={toHumanReadableContributionType(contributionType)}
          onChange={() =>
              props.onSelectContributionType(
                contributionType,
                props.switches,
                props.countryId,
                props.countryGroupId,
                props.useLocalCurrency,
              )
          }
          checked={props.contributionType === contributionType}
        />
      );
    })}
    </ChoiceCardGroup>
  );

  /* eslint-disable no-unused-vars */
  // leaving in place as this is still in active development:
  const renderControl = () => (
    <ul className="form__radio-group-list form__radio-group-list--border">
      {contributionTypes.map((contributionTypeSetting: ContributionTypeSetting) => {
        const { contributionType } = contributionTypeSetting;
        return (
          <li className="form__radio-group-item">
            <input
              id={`contributionType-${contributionType}`}
              className="form__radio-group-input"
              type="radio"
              name="contributionType"
              value={contributionType}
              onChange={() =>
                props.onSelectContributionType(
                  contributionType,
                  props.switches,
                  props.countryId,
                  props.countryGroupId,
                  props.useLocalCurrency,
                )
              }
              checked={props.contributionType === contributionType}
            />
            <label htmlFor={`contributionType-${contributionType}`} className="form__radio-group-label">
              {toHumanReadableContributionType(contributionType)}
            </label>
          </li>);
      })}
    </ul>
  );
  /* eslint-enable no-unused-vars */

  if (contributionTypes.length === 1 && contributionTypes[0].contributionType === 'ONE_OFF') {
    return null;
  }

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>How often would you like to contribute?</legend>
      {renderChoiceCards()}
    </fieldset>
  );
}

function withoutProps() {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>How often would you like to contribute?</legend>
      <ul className="form__radio-group-list form__radio-group-list--border">
        {
          ['a', 'b', 'c'].map(id => (
            <li className="form__radio-group-item">
              <input
                id={`contributionType-${id}`}
                className="form__radio-group-input"
                type="radio"
                name="contributionType"
              />
              <label htmlFor={`contributionType-${id}`} className="form__radio-group-label">&nbsp;</label>
            </li>
            ))
        }
      </ul>
    </fieldset>
  );
}

export const ContributionTypeTabs = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const EmptyContributionTypeTabs = withoutProps;
