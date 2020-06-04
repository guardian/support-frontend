// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { fetchJson, requestOptions } from 'helpers/fetch';
import type { State, Stripe3DSResult } from 'pages/contributions-landing/contributionsLandingReducer';
import { Stripe } from 'helpers/paymentMethods';
import { type PaymentResult } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type Action,
  onThirdPartyPaymentAuthorised,
  paymentFailure,
  paymentWaiting as setPaymentWaiting,
  setCreateStripePaymentMethod,
  setHandleStripe3DS,
  setStripeCardFormComplete,
  setStripeRecurringRecaptchaVerified,
  setStripeSetupIntentClientSecret,
} from 'pages/contributions-landing/contributionsLandingActions';
import { type ContributionType } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/errorReasons';
import { logException } from 'helpers/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { IsoCountry } from 'helpers/internationalisation/country';
import CreditCardsROW from './creditCardsROW.svg';
import CreditCardsUS from './creditCardsUS.svg';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { updateRecaptchaToken } from '../../contributionsLandingActions';
import { routes } from 'helpers/routes';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import type { LandingPageDesignSystemTestVariants } from 'helpers/abTests/abtestDefinitions';
import { InlineError } from '@guardian/src-inline-error';
import { StripeCardFormField } from './StripeCardFormField';
import './stripeCardForm.scss';
import QuestionMarkHintIcon from 'components/svgs/questionMarkHintIcon';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  stripe: Object, // Available through the injectStripe 'Higher-Order Component'
  onPaymentAuthorised: (paymentMethodId: string) => Promise<PaymentResult>,
  paymentFailure: (paymentError: ErrorReason) => Action,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: ((email: string) => void) => Action,
  setHandleStripe3DS: ((clientSecret: string) => Promise<Stripe3DSResult>) => Action,
  setPaymentWaiting: (isWaiting: boolean) => Action,
  paymentWaiting: boolean,
  setStripeCardFormComplete: (isComplete: boolean) => Action,
  setStripeSetupIntentClientSecret: (clientSecret: string) => Action,
  setStripeRecurringRecaptchaVerified: boolean => Action,
  checkoutFormHasBeenSubmitted: boolean,
  stripeKey: string,
  country: IsoCountry,
  countryGroupId: CountryGroupId,
  csrf: CsrfState,
  setupIntentClientSecret: string | null,
  recurringRecaptchaVerified: boolean,
  formIsSubmittable: boolean,
  setOneOffRecaptchaToken: string => Action,
  oneOffRecaptchaToken: string,
  postDeploymentTestUser: string,
  designSystemTestVariant: LandingPageDesignSystemTestVariants,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
  paymentWaiting: state.page.form.isWaiting,
  country: state.common.internationalisation.countryId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  csrf: state.page.csrf,
  setupIntentClientSecret: state.page.form.stripeCardFormData.setupIntentClientSecret,
  recurringRecaptchaVerified: state.page.form.stripeCardFormData.recurringRecaptchaVerified,
  formIsSubmittable: state.page.form.formIsSubmittable,
  oneOffRecaptchaToken: state.page.form.oneOffRecaptchaToken,
  postDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
  designSystemTestVariant: state.common.abParticipations.landingPageDesignSystemTest,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised: (paymentMethodId: string) =>
    dispatch(onThirdPartyPaymentAuthorised({
      paymentMethod: Stripe,
      stripePaymentMethod: 'StripeCheckout',
      paymentMethodId,
    })),
  paymentFailure: (paymentError: ErrorReason) => dispatch(paymentFailure(paymentError)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: (email: string) => void) =>
    dispatch(setCreateStripePaymentMethod(createStripePaymentMethod)),
  setHandleStripe3DS: (handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>) =>
    dispatch(setHandleStripe3DS(handleStripe3DS)),
  setStripeCardFormComplete: (isComplete: boolean) =>
    dispatch(setStripeCardFormComplete(isComplete)),
  setPaymentWaiting: (isWaiting: boolean) =>
    dispatch(setPaymentWaiting(isWaiting)),
  setStripeSetupIntentClientSecret: (clientSecret: string) => dispatch(setStripeSetupIntentClientSecret(clientSecret)),
  setOneOffRecaptchaToken: (recaptchaToken: string) => dispatch(updateRecaptchaToken(recaptchaToken)),
  setStripeRecurringRecaptchaVerified: (recaptchaVerified: boolean) =>
    dispatch(setStripeRecurringRecaptchaVerified(recaptchaVerified)),
});

type CardFieldState =
  {| name: 'Error', errorMessage: string |} |
  {| name: 'Incomplete' |} |
  {| name: 'Complete' |};

type CardFieldName = 'CardNumber' | 'Expiry' | 'CVC';

type StateTypes = {
  [CardFieldName]: CardFieldState,
  currentlySelected: CardFieldName | null,
};

const fieldStyleControl = {
  base: {
    fontFamily: '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
    fontSize: '16px',
    '::placeholder': {
      color: '#999999',
    },
    lineHeight: '24px',
  },
};

const fieldStyleDS = {
  base: {
    ...fieldStyleControl,
    fontSize: '17px',
    lineHeight: 1.5,
  },
};

const renderVerificationCopy = (countryGroupId: CountryGroupId, contributionType: ContributionType) => {
  trackComponentLoad(`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`);
  return (<div className="form__error"> {'Please tick to verify you\'re a human'} </div>);
};

const renderVerificationCopyDs = (countryGroupId: CountryGroupId, contributionType: ContributionType) => {
  trackComponentLoad(`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`);
  return (<InlineError>Please tick to verify you&apos;re a human</InlineError>);
};


const errorMessageFromState = (state: CardFieldState): string | null =>
  (state.name === 'Error' ? state.errorMessage : null);

class CardForm extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      CardNumber: { name: 'Incomplete' },
      Expiry: { name: 'Incomplete' },
      CVC: { name: 'Incomplete' },
      currentlySelected: null,
    };
  }

  componentDidMount(): void {
    if (this.props.contributionType === 'ONE_OFF') {
      this.setupOneOffHandlers();
    } else {
      this.setupRecurringHandlers();
    }
  }

  // If we have just received the setupIntentClientSecret and the user has already clicked 'Contribute'
  // then go ahead and process the recurring contribution
  componentDidUpdate(prevProps): void {
    const clientSecretHasUpdated = !prevProps.setupIntentClientSecret && this.props.setupIntentClientSecret;
    if (this.props.paymentWaiting && clientSecretHasUpdated && this.props.setupIntentClientSecret) {
      this.handleCardSetupForRecurring(this.props.setupIntentClientSecret);
    }
  }

  onChange = (fieldName: CardFieldName) => (update) => {
    let newFieldState = { name: 'Incomplete' };

    if (update.error) {
      newFieldState = { name: 'Error', errorMessage: update.error.message };
    } else if (update.complete) {
      newFieldState = { name: 'Complete' };
    }

    this.setState(
      { [fieldName]: newFieldState },
      () => this.props.setStripeCardFormComplete(this.formIsComplete()),
    );
  };

  onFocus = (fieldName: CardFieldName) => {
    this.setState({
      currentlySelected: fieldName,
    });
  };

  onBlur = () => {
    this.setState({
      currentlySelected: null,
    });
  };

  // Creates a new setupIntent upon recaptcha verification
  setupRecurringRecaptchaCallback = () => {
    window.grecaptcha.render('robot_checkbox', {
      sitekey: window.guardian.v2recaptchaPublicKey,
      callback: (token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        this.props.setStripeRecurringRecaptchaVerified(true);

        fetchJson(
          routes.stripeSetupIntentRecaptcha,
          requestOptions(
            { token, stripePublicKey: this.props.stripeKey },
            'same-origin',
            'POST',
            this.props.csrf,
          ),
        )
          .then((json) => {
            if (json.client_secret) {
              trackComponentLoad('contributions-recaptcha-verified');

              this.props.setStripeSetupIntentClientSecret(json.client_secret);
            } else {
              throw new Error(`Missing client_secret field in server response: ${JSON.stringify(json)}`);
            }
          })
          .catch((err) => {
            logException(`Error getting Setup Intent client_secret from ${routes.stripeSetupIntentRecaptcha}: ${err}`);
            this.props.paymentFailure('internal_error');
            this.props.setPaymentWaiting(false);
          });
      },
    });
  };

  setupRecaptchaTokenForOneOff = () => {
    window.grecaptcha.render('robot_checkbox', {
      sitekey: window.guardian.v2recaptchaPublicKey,
      callback: (token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        this.props.setOneOffRecaptchaToken(token);
      },
    });
  };

  setupRecurringHandlers(): void {
    // Start by requesting the client_secret for a new Payment Method.
    // Note - because this value is requested asynchronously when the component loads,
    // it's possible for it to arrive after the user clicks 'Contribute'.
    // This is handled in the callback below by checking the value of paymentWaiting.
    if (window.guardian.recaptchaEnabled) {
      if (window.grecaptcha && window.grecaptcha.render) {
        this.setupRecurringRecaptchaCallback();
      } else {
        window.v2OnloadCallback = this.setupRecurringRecaptchaCallback;
      }
    }

    this.props.setCreateStripePaymentMethod(() => {
      this.props.setPaymentWaiting(true);

      // Post-deploy tests bypass recaptcha, and no verification happens server-side for the test Stripe account
      if (!window.guardian.recaptchaEnabled || this.props.postDeploymentTestUser) {
        fetchJson(
          routes.stripeSetupIntentRecaptcha,
          requestOptions(
            { token: 'post-deploy-token', stripePublicKey: this.props.stripeKey },
            'same-origin',
            'POST',
            this.props.csrf,
          ),
        )
          .then((json) => {
            if (json.client_secret) {
              this.handleCardSetupForRecurring(json.client_secret);
            } else {
              throw new Error(`Missing client_secret field in server response: ${JSON.stringify(json)}`);
            }
          });
      }

      /* Recaptcha verification is required for setupIntent creation.
      If setupIntentClientSecret is ready then complete the payment now.
      If setupIntentClientSecret is not ready then componentDidUpdate will complete the payment when it arrives. */
      if (this.props.setupIntentClientSecret) {
        this.handleCardSetupForRecurring(this.props.setupIntentClientSecret);
      }
    });
  }

  setupOneOffHandlers(): void {
    if (window.guardian.recaptchaEnabled) {
      if (window.grecaptcha && window.grecaptcha.render) {
        this.setupRecaptchaTokenForOneOff();
      } else {
        window.v2OnloadCallback = this.setupRecaptchaTokenForOneOff;
      }
    }

    this.props.setCreateStripePaymentMethod(() => {
      this.props.setPaymentWaiting(true);

      this.props.stripe.createPaymentMethod('card').then((result) => {
        if (result.error) {
          this.handleStripeError(result.error);
        } else {
          this.props.onPaymentAuthorised(result.paymentMethod.id);
        }
      });
    });

    this.props.setHandleStripe3DS((clientSecret: string) => {
      trackComponentLoad('stripe-3ds');
      return this.props.stripe.handleCardAction(clientSecret);
    });
  }

  getFieldBorderClass = (fieldName: CardFieldName): string => {
    if (this.state.currentlySelected === fieldName) {
      return 'form__input-enabled';
    } else if (this.state[fieldName].name === 'Error') {
      return 'form__input--invalid';
    }
    return '';
  };

  handleStripeError(errorData: any): void {
    this.props.setPaymentWaiting(false);

    logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

    if (errorData.type === 'validation_error') {
      // This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
      // happen then display a generic error about card details
      this.props.paymentFailure('payment_details_incorrect');
    } else {
      // This is probably a Stripe or network problem
      this.props.paymentFailure('payment_provider_unavailable');
    }
  }

  handleCardSetupForRecurring(clientSecret: string): void {
    this.props.stripe.handleCardSetup(clientSecret).then((result) => {
      if (result.error) {
        this.handleStripeError(result.error);
      } else {
        this.props.onPaymentAuthorised(result.setupIntent.payment_method);
      }
    });
  }

  formIsComplete = () =>
    this.state.CardNumber.name === 'Complete' &&
    this.state.Expiry.name === 'Complete' &&
    this.state.CVC.name === 'Complete';

  render() {
    const fieldError: ?string =
      errorMessageFromState(this.state.CardNumber) ||
      errorMessageFromState(this.state.Expiry) ||
      errorMessageFromState(this.state.CVC);

    const incompleteMessage = (): ?string => {
      if (
        this.props.checkoutFormHasBeenSubmitted &&
        (
          this.state.CardNumber.name === 'Incomplete' ||
          this.state.Expiry.name === 'Incomplete' ||
          this.state.CVC.name === 'Incomplete'
        )
      ) {
        return 'Please complete your card details';
      }
      return undefined;
    };

    const errorMessage: ?string = fieldError || incompleteMessage();

    const getClasses = (fieldName: CardFieldName): string =>
      `form__input ${this.getFieldBorderClass(fieldName)}`;

    const showCards = (country: IsoCountry) => {
      if (country === 'US') {
        return <CreditCardsUS className="form__credit-card-icons" />;
      }
      return <CreditCardsROW className="form__credit-card-icons" />;
    };

    const showCardsDs = (country: IsoCountry) => {
      if (country === 'US') {
        return <CreditCardsUS />;
      }
      return <CreditCardsROW />;
    };

    const recaptchaVerified =
      this.props.contributionType === 'ONE_OFF' ?
        this.props.oneOffRecaptchaToken : this.props.recurringRecaptchaVerified;

    const renderControl = () => (
      <div className="form__fields">
        <legend className="form__legend"><h3>Your card details</h3></legend>
        <div className="form__field">
          <label className="form__label" htmlFor="stripeCardNumberElement">
            Card number
          </label>
          {showCards(this.props.country)}
          <span className={getClasses('CardNumber')}>
            <CardNumberElement
              id="stripeCardNumberElement"
              style={fieldStyleControl}
              onChange={this.onChange('CardNumber')}
              onFocus={() => this.onFocus('CardNumber')}
              onBlur={this.onBlur}
            />
          </span>
        </div>
        <div className="stripe-card-element-container__inline-fields">
          <div className="form__field">
            <label className="form__label" htmlFor="stripeCardExpiryElement">
              Expiry date
            </label>
            <span className={getClasses('Expiry')}>
              <CardExpiryElement
                id="stripeCardExpiryElement"
                style={fieldStyleControl}
                onChange={this.onChange('Expiry')}
                onFocus={() => this.onFocus('Expiry')}
                onBlur={this.onBlur}
              />
            </span>
          </div>
          <div className="form__field">
            <label className="form__label" htmlFor="stripeCardCVCElement">
              CVC
            </label>
            <span className={getClasses('CVC')}>
              <CardCVCElement
                id="stripeCardCVCElement"
                style={fieldStyleControl}
                placeholder=""
                onChange={this.onChange('CVC')}
                onFocus={() => this.onFocus('CVC')}
                onBlur={this.onBlur}
              />
            </span>
          </div>
        </div>
        {errorMessage ? <div className="form__error">{errorMessage}</div> : null}
        { window.guardian.recaptchaEnabled ?
          <div className="form__field">

            <label className="form__label" htmlFor="robot_checkbox">
              Security check
            </label>
            <Recaptcha />
            {
              this.props.checkoutFormHasBeenSubmitted
              && !recaptchaVerified ?
                renderVerificationCopy(this.props.countryGroupId, this.props.contributionType) : null
            }
          </div>
          : null }
      </div>
    );

    const renderDesignSystemStyleForm = () => (
      <div>
        <legend className="form__legend"><h3>Your card details</h3></legend>
        {errorMessage ?
          <InlineError> {errorMessage} </InlineError> : null
        }

        <StripeCardFormField
          label={
            <>
              <label
                htmlFor="stripeCardNumberElement"
              >
                Card number
              </label>
              {showCardsDs(this.props.country)}
            </>
          }
          input={
            <CardNumberElement
              id="stripeCardNumberElement"
              style={fieldStyleDS}
              onChange={this.onChange('CardNumber')}
              onFocus={() => this.onFocus('CardNumber')}
              onBlur={this.onBlur}
            />
          }
          error={this.state.CardNumber.name === 'Error'}
          focus={this.state.currentlySelected === 'CardNumber'}
        />

        <div

          className="ds-stripe-card-input__expiry-security-container"
        >
          <div
            className="ds-stripe-card-input__expiry"
          >
            <StripeCardFormField
              label={
                <label
                  htmlFor="stripeCardExpiryElement"
                >
                  Expiry date
                </label>
              }
              hint={
                <div
                  className="ds-stripe-card-input__expiry-hint"
                >
                  MM / YY
                </div>
              }
              input={
                <CardExpiryElement
                  id="stripeCardExpiryElement"
                  style={fieldStyleControl}
                  placeholder=""
                  onChange={this.onChange('Expiry')}
                  onFocus={() => this.onFocus('Expiry')}
                  onBlur={this.onBlur}
                />
              }
              error={this.state.Expiry.name === 'Error'}
              focus={this.state.currentlySelected === 'Expiry'}

            />
          </div>

          <div
            className="ds-stripe-card-input__security-code"
          >
            <StripeCardFormField
              label={
                <label
                  htmlFor="stripeCardCVCElement"
                >
                  Security code
                </label>
              }
              hint={
                <div
                  className="ds-stripe-card-input__security-code-hint"
                >
                  <div
                    className="ds-stripe-card-input__security-code-hint-icon"
                  >
                    <QuestionMarkHintIcon />
                  </div>
                  <div
                    className="ds-stripe-card-input__security-code-hint-tooltip"
                  >
                    <p
                      className="ds-stripe-card-input__security-code-hint-tooltip-heading"
                    >
                      What&apos;s this?
                    </p>
                    <p>The last three digits on the back of your card, above the signature</p>
                  </div>
                </div>
              }
              input={
                <CardCVCElement
                  id="stripeCardCVCElement"
                  style={fieldStyleControl}
                  placeholder=""
                  onChange={this.onChange('CVC')}
                  onFocus={() => this.onFocus('CVC')}
                  onBlur={this.onBlur}
                />
              }
              error={this.state.CVC.name === 'Error'}
              focus={this.state.currentlySelected === 'CVC'}

            />
          </div>
        </div>
        { window.guardian.recaptchaEnabled ?
          <div
            className="ds-security-check"
          >
            <div
              className="ds-security-check__label"
            >
              <label
                htmlFor="robot_checkbox"
              >
                Security check
              </label>
            </div>
            {
              this.props.checkoutFormHasBeenSubmitted
              && !recaptchaVerified ?
                renderVerificationCopyDs(this.props.countryGroupId, this.props.contributionType) : null
            }
            <Recaptcha />
          </div>
          : null
        }
      </div>
    );

    return this.props.designSystemTestVariant === 'ds' ? renderDesignSystemStyleForm() : renderControl();
  }
}

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
