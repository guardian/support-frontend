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
import { StripeCardFormField, guardianTextSansWeb } from "./StripeCardFormField";

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
    fontFamily: guardianTextSansWeb,
    fontSize: '16px',
    '::placeholder': {
      color: '#999999',
    },
    lineHeight: '24px',
  },
};

const fieldStyleDS = {
  base: {
    fontFamily: guardianTextSansWeb,
    fontSize: '17px',
    '::placeholder': {
      color: '#999999',
    },
    lineHeight: 1.5,
  },
};

const renderVerificationCopy = (countryGroupId: CountryGroupId, contributionType: ContributionType) => {
  trackComponentLoad(`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`);
  return (<InlineError>Please tick to verify you're a human</InlineError>);
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
      const css = {
        float: 'right',
        position: 'absolute',
        right: 0,
      };
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
            <span>Card number</span>
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
              <span>Expiry date</span>
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
              <span>CVC</span>
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
              <span>Security check</span>
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
          labelChildren={
            <>
              Card number
              {showCardsDs(this.props.country)}
            </>
          }
          inputChildren={
            <CardNumberElement
              id="stripeCardNumberElement"
              style={fieldStyleDS}
              onChange={this.onChange('CardNumber')}
              onFocus={() => this.onFocus('CardNumber')}
              onBlur={this.onBlur}
            />
          }
          error={this.state['CardNumber'].name === 'Error'}
        />

        <div
          css={{
            display: 'flex',
            marginTop: '10px',
          }}
        >
          <label
            css={{
              width: '30%',
              marginRight: '8px',
            }}
          >
            <StripeCardFormField
              labelChildren={
                <>
                  Expiry date
                </>
              }
              hintChildren={
                <div
                  css={{
                    fontSize: '15px',
                    lineHeight: 1.5,
                    color: '#767676',
                    marginBottom: '4px',
                    fontWeight: 400,
                  }}
                >
                  MM / YY
                </div>
              }
              inputChildren={
                <CardExpiryElement
                  id="stripeCardExpiryElement"
                  style={fieldStyleControl}
                  placeholder=""
                  onChange={this.onChange('Expiry')}
                  onFocus={() => this.onFocus('Expiry')}
                  onBlur={this.onBlur}
                />
              }
              error={this.state['Expiry'].name === 'Error'}
            />
          </label>

          <label
            css={{
              width: '30%',
              marginLeft: '8px',
            }}
          >
            <StripeCardFormField
              labelChildren={
                <>
                  Security code
                </>
              }
              hintChildren={
                <div
                  css={{
                    position: 'relative',
                    cursor: 'pointer',
                    zIndex: 1,
                    '&:hover div': {
                      visibility: 'visible',
                    },
                    width: '18px',
                  }}
                >
                  <div
                    css={{
                      fontSize: '11px',
                      lineHeight: 1.5,
                      width: '14px',
                      height: '14px',
                      background: '#999999',
                      fontWeight: 700,
                      marginBottom: '9px',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '50%',
                      padding: '0 2px 4px 2px',
                    }}
                  >
                    ?
                  </div>
                  <div
                    css={{
                      background: '#EDEDED',
                      width: '224px',
                      height: '111px',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      visibility: 'hidden',
                      position: 'absolute',
                      padding: '10px',
                      top: '-115px',
                      left: '25px',
                    }}
                  >
                    <p
                      css={{
                        fontWeight: 900,
                      }}
                    >
                      What's this?
                    </p>
                    <p>The last three digits on the back of your card, above the signature</p>
                  </div>
                </div>
              }
              inputChildren={
                <CardCVCElement
                  id="stripeCardCVCElement"
                  style={fieldStyleControl}
                  placeholder=""
                  onChange={this.onChange('CVC')}
                  onFocus={() => this.onFocus('CVC')}
                  onBlur={this.onBlur}
                />
              }
              error={this.state['CVC'].name === 'Error'}
            />
          </label>
        </div>
        { window.guardian.recaptchaEnabled ?
          <div
            css={{
              marginTop: '10px',
            }}
          >
            <label
              css={{
                fontSize: '17px',
                fontWeight: 700,
                lineHeight: 1.5,
                fontFamily: guardianTextSansWeb,
                marginBottom: '4px',
              }}
              htmlFor="robot_checkbox"
            >
              <span>Security check</span>
            </label>
            {
              this.props.checkoutFormHasBeenSubmitted
              && !recaptchaVerified ?
                renderVerificationCopy(this.props.countryGroupId, this.props.contributionType) : null
            }
            <Recaptcha />
          </div>
          : null
        }
      </div>
    );

    return this.props.designSystemTestVariant === 'ds' ? renderDesignSystemStyleForm() : renderControl()
  }
}

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
