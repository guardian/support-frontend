// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgSubscribed from 'components/svgs/subscribed';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { checkEmail } from 'helpers/formValidation';
import { logException } from 'helpers/logger';
import Button from 'components/button/button';
import NonInteractiveButton from 'components/button/nonInteractiveButton';
import { CheckboxInput } from 'components/forms/customFields/checkbox';
import 'components/marketingConsent/marketingConsent.scss';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionType } from 'helpers/contributions';
// ----- Types ----- //

type SharedPropTypes = {|
  confirmOptIn: ?boolean,
  email: string,
  csrf: CsrfState,
  onClick: (?string, CsrfState) => void,
  requestPending: boolean,
|}

type ButtonPropTypes = {|
  ...SharedPropTypes,
  checkboxChecked: boolean,
|};

type PropTypes = {|
  ...SharedPropTypes,
  error: boolean,
  renderMessage: ({title: string, message: string}) => Node,
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
|};

type StateTypes ={|
  checkboxChecked: boolean,
|}

// ----- Render ----- //

function MarketingButton(props: ButtonPropTypes) {
  if (props.confirmOptIn === true) {
    return (
      <NonInteractiveButton
        appearance="greyHollow"
        iconSide="right"
        icon={<SvgSubscribed />}
      >
        Signed up
      </NonInteractiveButton>
    );
  } else if (props.requestPending === true) {
    return (
      <NonInteractiveButton
        appearance="greyHollow"
        iconSide="right"
        icon={<SvgSubscribe />}
      >
        Pending...
      </NonInteractiveButton>
    );
  } else if (!props.checkboxChecked) {
    return (
      <Button
        disabled
        appearance="disabled"
        iconSide="right"
        icon={<SvgSubscribe />}
      >
        Sign me up
      </Button>
    );
  }
  return (
    <Button
      appearance="greyHollow"
      iconSide="right"
      aria-label="Sign me up to news and offers from The Guardian"
      onClick={
          () => props.onClick(props.email, props.csrf)
        }
      icon={<SvgSubscribe />}
    >
        Sign me up
    </Button>
  );
}

const createRegionalTextVariations = (titleFreq: string, msgFreq: string): { titleFreq: string, msgFreq: string } => ({
  titleFreq,
  msgFreq,
});

const copy = {
  ukRowRecurring: createRegionalTextVariations('a weekly email', 'from the week '),
  allSinglePlusUsAusRecurring: createRegionalTextVariations('occasional emails', ''),
};

const getCopyTexts = (countryGroupId: CountryGroupId, contributionType: ContributionType) => {

  if (contributionType === 'ONE_OFF' || countryGroupId === 'UnitedStates' || countryGroupId === 'AUDCountries') {
    return copy.allSinglePlusUsAusRecurring;
  }
  return copy.ukRowRecurring;
};

const renderMessage = ({ title, message }: {title: string, message: string}) => (
  <div>
    <h3 className="contribution-thank-you-block__title">{title}</h3>
    <p className="contribution-thank-you-block__message">
      {message}
    </p>
  </div>);

class MarketingConsentWithCheckbox extends Component<PropTypes, StateTypes> {
  static defaultProps = {
    error: false,
    requestPending: false,
    renderMessage,
  };

  state = {
    checkboxChecked: false,
  }

  render() {
    const frequencyCopy: { titleFreq: string, msgFreq: string } =
    getCopyTexts(this.props.countryGroupId, this.props.contributionType);

    if (this.props.error) {
      return (<GeneralErrorMessage
        classModifiers={['marketing_consent_api_error']}
        errorHeading="Sorry, something went wrong"
        errorReason="marketing_consent_api_error"
      />);
    }

    if (checkEmail(this.props.email)) {
      return (
        <section className={classNameWithModifiers('component-marketing-consent', ['newsletter', 'with-checkbox'])}>
          {this.props.renderMessage({
            title: `Would you like to receive ${frequencyCopy.titleFreq} from inside The Guardian?`,
            message: `Our membership editor will discuss the most important news stories ${frequencyCopy.msgFreq}and suggest compelling articles to read. Opt in below to receive this and more information on ways to support The Guardian.`,
          })}

          <CheckboxInput
            id="marketing-checkbox"
            text="Contributions, subscriptions and membership: Get related news and offers – whether you are a contributor, subscriber, member or would like to become one. You can unsubscribe at any time."
            onChange={(e) => {
              this.setState({
                checkboxChecked: e.target.checked,
              });
            }}
          />

          {MarketingButton({
            confirmOptIn: this.props.confirmOptIn,
            email: this.props.email,
            csrf: this.props.csrf,
            onClick: this.props.onClick,
            requestPending: this.props.requestPending,
            checkboxChecked: this.state.checkboxChecked,
          })}

          <p className="component-marketing-consent-confirmation">
            <small>
              {this.props.confirmOptIn === true ?
                'We\'ll be in touch. Check your inbox for a confirmation link.' :
                <div>
                  <span className="component-marketing-consent-confirmation__message">You can unsubscribe at any time</span>
                </div>
              }
            </small>
          </p>
        </section>
      );
    }

    logException('Unable to display marketing consent button due to not having a valid email address to send to the API');
    return null;
  }
}

// ----- Exports ----- //
export default MarketingConsentWithCheckbox;
