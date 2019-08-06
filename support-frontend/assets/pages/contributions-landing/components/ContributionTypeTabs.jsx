// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import {
  getPaymentMethodToSelect,
  toHumanReadableContributionType,
  toHumanReadableContributionTypeAbTest,
} from 'helpers/checkouts';

import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type State } from '../contributionsLandingReducer';
import { updateContributionTypeAndPaymentMethod } from '../contributionsLandingActions';
import type { ContributionTypes, ContributionTypeSetting } from 'helpers/contributions';
<<<<<<< HEAD
import type { LandingPageChoiceArchitectureLabelsTestVariants } from 'helpers/abTests/abtestDefinitions';
=======
import type { LandingPageChoiceArchitectureAmountsFirstTestVariants } from 'assets/helpers/abTests/abtestDefinitions';
>>>>>>> layout reversed

// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  switches: Switches,
  contributionTypes: ContributionTypes,
  onSelectContributionType: (ContributionType, Switches, IsoCountry, CountryGroupId) => void,
  landingPageChoiceArchitectureLabelsTestVariants: LandingPageChoiceArchitectureLabelsTestVariants
  landingPageChoiceArchitectureAmountsFirstTestVariant: LandingPageChoiceArchitectureAmountsFirstTestVariants,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
  contributionTypes: state.common.settings.contributionTypes,
  landingPageChoiceArchitectureLabelsTestVariants: state.common.abParticipations.landingPageChoiceArchitectureLabels,
  landingPageChoiceArchitectureAmountsFirstTestVariant:
  state.common.abParticipations.landingPageChoiceArchitectureAmountsFirst,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onSelectContributionType: (
    contributionType: ContributionType,
    switches: Switches,
    countryId: IsoCountry,
    countryGroupId: CountryGroupId,
  ) => {
    const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);
    trackComponentClick(`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`);
    dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethodToSelect));
  },
});

// ----- Render ----- //

function withProps(props: PropTypes) {
  const contributionTypes = props.contributionTypes[props.countryGroupId];
  const isLabelTestVariant = props.landingPageChoiceArchitectureLabelsTestVariants === 'withLabels';
  const createContributionTypeLabel = isLabelTestVariant ?
    toHumanReadableContributionTypeAbTest :
    toHumanReadableContributionType;

  if (contributionTypes.length === 1 && contributionTypes[0].contributionType === 'ONE_OFF') {
    return (null);
  }

  const isTestVariant =
    props.landingPageChoiceArchitectureAmountsFirstTestVariant === 'amountsFirstSetOne' ||
    props.landingPageChoiceArchitectureAmountsFirstTestVariant === 'amountsFirstSetTwo';

  const titleCopy = isTestVariant ? 'How often would you like to give?' : 'How often would you like to contribute?';

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>{titleCopy}</legend>
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
                  )
                }
                checked={props.contributionType === contributionType}
              />
              <label htmlFor={`contributionType-${contributionType}`} className="form__radio-group-label">
                {createContributionTypeLabel(contributionType)}
              </label>
            </li>);
        })}
      </ul>
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
