// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { routes } from 'helpers/routes';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';

import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';

import {
  changeContribType,
  changeContribAmount,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
  payPalError,
} from '../contributionsLandingActions';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  toggleContribType: (string) => void,
  changeContribAnnualAmount: (string) => void,
  changeContribMonthlyAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  isoCountry: IsoCountry,
  payPalErrorHandler: (string) => void,
  payPalError: ?string,
  abTests: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
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

const subHeadingMonthlyText = {
  GB: 'from £5 a month',
  US: 'from $5 a month',
};

const subHeadingOneOffText = {
  GB: '',
  US: '',
};

const contentText = {
  GB: 'Support the Guardian\'s editorial operations by making a monthly or one-off contribution today',
  US: 'Your contribution funds and supports the Guardian\'s journalism',
};

const contribCtaText = {
  ANNUAL: 'Contribute with card or PayPal',
  MONTHLY: 'Contribute with card or PayPal',
  ONE_OFF: 'Contribute with debit/credit card',
};

function contribAttrs(isoCountry: IsoCountry, contribType: Contrib): ContribAttrs {
  const subHeadingText = contribType === 'ONE_OFF' ? subHeadingOneOffText[isoCountry] : subHeadingMonthlyText[isoCountry];

  return {
    heading: 'contribute',
    subheading: subHeadingText,
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
      abParticipations={props.abTests}
      referrerAcquisitionData={props.referrerAcquisitionData}
      isoCountry={props.isoCountry}
      errorHandler={props.payPalErrorHandler}
      canClick={!props.contribError}
      buttonText="Contribute with PayPal"
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

const getContribAttrs = (
  contribType: Contrib,
  contribAmount: Amounts,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
): ContribAttrs => {

  const contType = getContribKey(contribType);
  const params = new URLSearchParams();
  const intCmp = referrerAcquisitionData.campaignCode;
  const refpvid = referrerAcquisitionData.referrerPageviewId;

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

  const attrs: ContribAttrs = getContribAttrs(props.contribType,
    props.contribAmount,
    props.referrerAcquisitionData,
    props.isoCountry);

  attrs.showPaymentLogos = true;

  const onClick = () => {
    if (!props.contribError) {
      window.location = attrs.ctaLink;
    }
  };

  const accessibilityHint = `Make your ${props.contribType.toLowerCase()} contribution`;

  return (
    <Bundle {...attrs}>
      <p>
        {contentText[props.isoCountry]}
      </p>
      <ContribAmounts
        onNumberInputKeyPress={onClick}
        {...props}
      />
      <CtaLink
        ctaId="contribute"
        text={attrs.ctaText}
        onClick={onClick}
        id="qa-contribute-button"
        accessibilityHint={accessibilityHint}
      />
      {showPayPal(props)}
      {showPayPalError(props)}
    </Bundle>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    contribType: state.page.type,
    contribAmount: state.page.amount,
    contribError: state.page.error,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    isoCountry: state.common.country,
    payPalError: state.page.payPalError,
    abTests: state.common.abParticipations,
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
