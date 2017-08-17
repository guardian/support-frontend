// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import { routes } from 'helpers/routes';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';

import {
  changeContribType,
  changeContribAmount,
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../actions/contributionsLandingActions';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  showMonthly: boolean,
  intCmp: string,
  toggleContribType: (string) => void,
  changeContribRecurringAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  isoCountry: IsoCountry,
};

/* eslint-enable react/no-unused-prop-types */

type ContribAttrs = {
  heading: string,
  subheading: string,
  ctaText: string,
  modifierClass: string,
  ctaLink: string,
  showPaymentLogos: boolean,
}


// ----- Copy ----- //

const subHeadingText = {
  GB: `Support the Guardian’s editorial operations by making a
    monthly or one-off contribution today`,
  US: `Support the Guardian’s editorial operations by making a
    regular or one-time contribution today`,
};

const oneOffSubHeadingText = {
  GB: 'Support the Guardian’s editorial operations by making a one-off contribution today',
  US: 'Support the Guardian’s editorial operations by making a one-time contribution today',
};

function contribAttrs(isoCountry: IsoCountry): ContribAttrs {
  return {
    heading: 'contribute',
    subheading: subHeadingText[isoCountry],
    ctaText: 'Contribute',
    modifierClass: 'contributions',
    ctaLink: '',
    showPaymentLogos: false,
  };
}

const ctaLinks = {
  recurring: routes.recurringContribCheckout,
  oneOff: routes.oneOffContribCheckout,
};


// ----- Functions ----- //

const getContribAttrs = ({
  contribType, contribAmount, intCmp, showMonthly, isoCountry,
}): ContribAttrs => {

  const contType = contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const params = new URLSearchParams();

  params.append('contributionValue', contribAmount[contType].value);

  if (intCmp) {
    params.append('INTCMP', intCmp);
  }

  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  if (!showMonthly) {

    const subheading = oneOffSubHeadingText[isoCountry];
    return Object.assign({}, contribAttrs(isoCountry), { ctaLink, subheading });

  }

  return Object.assign({}, contribAttrs(isoCountry), { ctaLink });

};


// ----- Component ----- //

function ContributionsBundle(props: PropTypes) {

  const attrs: ContribAttrs = getContribAttrs(props);

  attrs.showPaymentLogos = true;

  const onClick = () => {
    if (!props.contribError) {
      window.location = attrs.ctaLink;
    }
  };

  return (
    <Bundle {...attrs}>
      <ContribAmounts
        onNumberInputKeyPress={onClick}
        {...props}
      />
      <CtaLink text={attrs.ctaText} onClick={onClick} />
    </Bundle>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  const showMonthly =
    state.abTests.contributionsLandingAddingMonthly !== 'control';

  return {
    contribType: showMonthly ? state.contribution.type : 'ONE_OFF',
    contribAmount: state.contribution.amount,
    contribError: state.contribution.error,
    intCmp: state.intCmp,
    showMonthly,
    isoCountry: state.isoCountry,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
    changeContribRecurringAmount: (value: string) => {
      dispatch(changeContribAmountRecurring({ value, userDefined: false }));
    },
    changeContribOneOffAmount: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
    changeContribAmount: (value: string) => {
      dispatch(changeContribAmount({ value, userDefined: true }));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsBundle);
