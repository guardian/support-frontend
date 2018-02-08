// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { routes } from 'helpers/routes';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import PayPalContributionButton from 'components/paymentButtons/payPalContributionButton/payPalContributionButton';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';

import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency, Currency } from 'helpers/internationalisation/currency';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';

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
  showSecureLogo: boolean,
}


// ----- Copy ----- //

const subHeadingMonthlyText: {[IsoCurrency]: string} = {
  GBP: 'from £5 a month',
  USD: 'from $5 a month',
  AUD: 'from $5 a month',
  EUR: 'from €5 a month',
};

function getSubHeadingMonthly(abTests: Participations, isoCurrency: IsoCurrency) {
  return subHeadingMonthlyText[isoCurrency];
}

const subHeadingOneOffText = {
  GBP: '',
  USD: '',
  AUD: '',
  EUR: '',
};

const defaultContentText = {
  GBP: 'Support The Guardian’s editorial operations by making a monthly or one-off contribution today',
  USD: (
    <span>
      Contributing to The Guardian makes a big impact. If you’re able, please consider
      <strong> monthly</strong> support &ndash; it will help to fund our journalism for
      the long term.
    </span>
  ),
  AUD: (
    <span>
      Contributing to The Guardian makes a big impact. If you’re able, please consider
      <strong> monthly</strong> support &ndash; it will help to fund our journalism for
      the long term.
    </span>
  ),
  EUR: (
    <span>
      Contributing to The Guardian makes a big impact. If you’re able, please consider
      <strong> monthly</strong> support &ndash; it will help to fund our journalism for
      the long term.
    </span>
  ),
};

const upsellRecurringContributionsTestContentText = {
  control: defaultContentText.US,
  benefitsOfBoth: (
    <span>
      Make a monthly commitment to support The Guardian long-term or a one-time contribution
      as and when you feel like it – choose the option that suits you best
    </span>
  ),
  bolderControl: (
    <span>
      If you’re able, please consider monthly support –
      it will help to fund The Guardian’s journalism for the long term.
    </span>
  ),
};

function getContentText(props: PropTypes) {
  return upsellRecurringContributionsTestContentText[props.abTests.upsellRecurringContributions] ||
    defaultContentText[props.isoCountry];
}

function ContentText(props: PropTypes) {
  return <p className="component-bundle__content-intro"> {getContentText(props)} </p>;
}

const contribCtaText = {
  ANNUAL: 'Contribute with card or PayPal',
  MONTHLY: 'Contribute with card or PayPal',
  ONE_OFF: 'Contribute with debit/credit card',
};

function contribAttrs(
  isoCurrency: IsoCurrency,
  contribType: Contrib,
  abTests: Participations,
): ContribAttrs {
  const subHeadingText = contribType === 'ONE_OFF'
    ? subHeadingOneOffText[isoCurrency]
    : getSubHeadingMonthly(abTests, isoCurrency);

  return {
    heading: 'contribute',
    subheading: subHeadingText,
    ctaText: contribCtaText[contribType],
    modifierClass: 'contributions',
    ctaLink: '',
    showPaymentLogos: false,
    showSecureLogo: false,
  };
}

function showPayPal(props: PropTypes) {
  if (props.contribType === 'ONE_OFF') {
    return (<PayPalContributionButton
      amount={Number(props.contribAmount.oneOff.value)}
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
  currency: IsoCurrency,
  abTests: Participations,
): ContribAttrs => {

  const contType = getContribKey(contribType);
  const params = new URLSearchParams();
  const intCmp = referrerAcquisitionData.campaignCode;
  const refpvid = referrerAcquisitionData.referrerPageviewId;

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);
  params.append('currency', currency);

  if (intCmp) {
    params.append('INTCMP', intCmp);
  }

  if (refpvid) {
    params.append('REFPVID', refpvid);
  }

  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, contribAttrs(currency, contribType, abTests), { ctaLink });

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
    props.currency.iso,
    props.abTests,
  );

  attrs.showPaymentLogos = true;
  attrs.showSecureLogo = props.abTests.usSecureLogoTest === 'logo';

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


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    contribType: state.page.type,
    contribAmount: state.page.amount,
    contribError: state.page.error,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    isoCountry: state.common.country,
    currency: state.common.currency,
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
