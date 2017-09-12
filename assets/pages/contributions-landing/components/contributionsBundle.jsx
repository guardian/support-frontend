// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { routes } from 'helpers/routes';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';

import {
  changeContribType,
  changeContribAmount,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
  payPalError,
} from '../actions/contributionsLandingActions';
import type { Participations } from '../../../helpers/abtest';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  intCmp: string,
  refpvid: string,
  toggleContribType: (string) => void,
  changeContribAnnualAmount: (string) => void,
  changeContribMonthlyAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  isoCountry: IsoCountry,
  payPalErrorHandler: (string) => void,
  payPalError: ?string,
  abTests: Participations,
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
    monthly or one-time contribution today`,
};

const contribCtaText = {
  ANNUAL: 'Contribute with card or PayPal',
  MONTHLY: 'Contribute with card or PayPal',
  ONE_OFF: 'Contribute with debit/credit card',
};

function contribAttrs(isoCountry: IsoCountry, contribType: Contrib): ContribAttrs {
  return {
    heading: 'contribute',
    subheading: subHeadingText[isoCountry],
    ctaText: contribCtaText[contribType],
    modifierClass: 'contributions',
    ctaLink: '',
    showPaymentLogos: false,
  };
}

function showPayPal(props: PropTypes) {
  if (props.contribType === 'ONE_OFF') {
    return (<PayPalContributionButton
      amount={props.contribAmount.oneOff.value}
      intCmp={props.intCmp}
      refpvid={props.refpvid}
      isoCountry={props.isoCountry}
      errorHandler={props.payPalErrorHandler}
      canClick={!props.contribError}
    />);
  }
  return null;
}

function showPayPalError(props: PropTypes) {
  if (props.contribType === 'ONE_OFF') {
    return (props.payPalError ? <ErrorMessage message={props.payPalError} /> : null);
  }
  return null;
}

const ctaLinks = {
  annual: routes.recurringContribCheckout,
  monthly: routes.recurringContribCheckout,
  oneOff: routes.oneOffContribCheckout,
};


// ----- Functions ----- //

function getContribKey(contribType) {
  switch (contribType) {
    case 'ANNUAL': return 'annual';
    case 'MONTHLY': return 'monthly';
    default: return 'oneOff';
  }
}

const getContribAttrs = ({
  contribType, contribAmount, intCmp, refpvid, isoCountry,
}): ContribAttrs => {

  const contType = getContribKey(contribType);
  const params = new URLSearchParams();

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);

  if (intCmp) {
    params.append('INTCMP', intCmp);
  }

  if (refpvid) {
    params.append('REFPVID', refpvid);
  }

  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, contribAttrs(isoCountry, contribType), { ctaLink });

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
      <CtaLink text={attrs.ctaText} onClick={onClick} id="qa-contribute-button" />
      {showPayPal(props)}
      {showPayPalError(props)}
    </Bundle>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    contribType: state.contribution.type,
    contribAmount: state.contribution.amount,
    contribError: state.contribution.error,
    intCmp: state.intCmp,
    refpvid: state.refpvid,
    isoCountry: state.isoCountry,
    payPalError: state.contribution.payPalError,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
    changeContribAnnualAmount: (value: string) => {
      dispatch(changeContribAmountAnnual({ value, userDefined: false }));
    },
    changeContribMonthlyAmount: (value: string) => {
      dispatch(changeContribAmountMonthly({ value, userDefined: false }));
    },
    changeContribOneOffAmount: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
    changeContribAmount: (value: string) => {
      dispatch(changeContribAmount({ value, userDefined: true }));
    },
    payPalErrorHandler: (message: string) => {
      dispatch(payPalError(message));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsBundle);
