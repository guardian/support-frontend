// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { routes } from 'helpers/routes';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import PayPalContributionButton from 'containerisableComponents/payPalContributionButton/payPalContributionButton';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';

import { getContribKey } from 'helpers/contributions';

import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

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
  toggleContribType: (string, CountryGroupId) => void,
  changeContribAnnualAmount: (string, CountryGroupId) => void,
  changeContribMonthlyAmount: (string, CountryGroupId) => void,
  changeContribOneOffAmount: (string, CountryGroupId) => void,
  changeContribAmount: (string, CountryGroupId) => void,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  currency: Currency,
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

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    contribType: state.page.type,
    contribAmount: state.page.amount,
    contribError: state.page.error,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    isoCountry: state.common.country,
    countryGroupId: state.common.countryGroup,
    currency: state.common.currency,
    payPalError: state.page.payPalError,
    abTests: state.common.abParticipations,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    toggleContribType: (period: Contrib, countryGroupId) => {
      dispatch(changeContribType(period, countryGroupId));
    },
    changeContribAnnualAmount: (value: string, countryGroupId) => {
      dispatch(changeContribAmountAnnual({ value, userDefined: false }, countryGroupId));
    },
    changeContribMonthlyAmount: (value: string, countryGroupId) => {
      dispatch(changeContribAmountMonthly({ value, userDefined: false }, countryGroupId));
    },
    changeContribOneOffAmount: (value: string, countryGroupId) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }, countryGroupId));
    },
    changeContribAmount: (value: string, countryGroupId: CountryGroupId) => {
      dispatch(changeContribAmount({ value, userDefined: true }, countryGroupId));
    },
    payPalErrorHandler: (message: string) => {
      dispatch(payPalError(message));
    },
  };

}


// ----- Copy ----- //

const subHeadingMonthlyText: {[CountryGroupId]: string} = {
  GBPCountries: 'from £5 a month',
  UnitedStates: 'from $5 a month',
  AUDCountries: '',
  EURCountries: '',
  International: '',
  NZDCountries: '',
};

const subHeadingOneOffText = {
  GBPCountries: '',
  UnitedStates: '',
  AUDCountries: '',
  EURCountries: '',
  International: '',
  NZDCountries: '',
};

const defaultContentText = {
  GBPCountries: 'Support The Guardian’s editorial operations by making a monthly or one-off contribution today',
  UnitedStates: (
    <span>
      Make a monthly commitment to support The Guardian long-term or a one-time contribution
      as and when you feel like it &ndash; choose the option that suits you best.
    </span>
  ),
  AUDCountries: (
    <span>
      Your contribution funds and supports The&nbsp;Guardian&#39;s journalism.
    </span>
  ),
  EURCountries: (
    <span>
      Your contribution funds and supports The&nbsp;Guardian&#39;s journalism.
    </span>
  ),
  International: '',
  NZDCountries: '',
};

function ContentText(props: PropTypes) {
  return <p className="component-bundle__content-intro"> {defaultContentText[props.countryGroupId]} </p>;
}

function getCtaText(contribType: Contrib, currency: Currency, amounts: Amounts) {

  const paymentMethods = contribType === 'ONE_OFF' ? 'card' : 'card or PayPal';
  const contType = getContribKey(contribType);

  return `Contribute ${currency.glyph}${amounts[contType].value} with ${paymentMethods}`;

}

function contribAttrs(
  countryGroupId: CountryGroupId,
  contribType: Contrib,
  currency: Currency,
  amounts: Amounts,
): ContribAttrs {
  const subHeadingText = contribType === 'ONE_OFF'
    ? subHeadingOneOffText[countryGroupId]
    : subHeadingMonthlyText[countryGroupId];

  return {
    heading: 'contribute',
    subheading: subHeadingText,
    ctaText: getCtaText(contribType, currency, amounts),
    modifierClass: 'contributions',
    ctaLink: '',
    showPaymentLogos: false,
  };
}

function showPayPal(props: PropTypes) {
  if (props.contribType === 'ONE_OFF') {
    return (<PayPalContributionButton
      amount={Number(props.contribAmount.oneOff.value)}
      abParticipations={props.abTests}
      referrerAcquisitionData={props.referrerAcquisitionData}
      isoCountry={props.isoCountry}
      countryGroupId={props.countryGroupId}
      errorHandler={props.payPalErrorHandler}
      canClick={!props.contribError}
      buttonText={`Contribute ${props.currency.glyph}${props.contribAmount.oneOff.value} with PayPal`}
    />);
  }
  return null;
}

const ctaLinks = {
  annual: routes.recurringContribCheckout,
  monthly: routes.recurringContribCheckout,
  oneOff: routes.oneOffContribCheckout,
};


// ----- Functions ----- //

const getContribAttrs = (
  contribType: Contrib,
  contribAmount: Amounts,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  countryGroupId: CountryGroupId,
  currency: Currency,
): ContribAttrs => {

  const contType = getContribKey(contribType);
  const params = new URLSearchParams();
  const intCmp = referrerAcquisitionData.campaignCode;
  const refpvid = referrerAcquisitionData.referrerPageviewId;

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);
  params.append('currency', currency.iso);
  params.append('countryGroup', countryGroupId);

  if (intCmp) {
    params.append('INTCMP', intCmp);
  }

  if (refpvid) {
    params.append('REFPVID', refpvid);
  }

  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign(
    {},
    contribAttrs(countryGroupId, contribType, currency, contribAmount),
    { ctaLink },
  );

};

function TermsAndPrivacy(props: { country: IsoCountry, contribType: Contrib }) {

  if (props.contribType === 'ONE_OFF') {
    return <TermsPrivacy country={props.country} />;
  }

  return null;

}


// ----- Component ----- //

function ContributionsBundle(props: PropTypes) {

  const attrs: ContribAttrs = getContribAttrs(
    props.contribType,
    props.contribAmount,
    props.referrerAcquisitionData,
    props.isoCountry,
    props.countryGroupId,
    props.currency,
  );

  attrs.showPaymentLogos = true;

  const onClick = () => {
    if (!props.contribError) {
      window.location = attrs.ctaLink;
    }
  };

  const accessibilityHint = `Make your ${props.contribType.toLowerCase()} contribution`;

  return (
    <Bundle {...attrs}>
      <ContentText
        {...props}
      />
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
      <ErrorMessage showError={props.contribType === 'ONE_OFF'} message={props.payPalError} />
      <TermsAndPrivacy country={props.isoCountry} contribType={props.contribType} />
    </Bundle>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsBundle);
