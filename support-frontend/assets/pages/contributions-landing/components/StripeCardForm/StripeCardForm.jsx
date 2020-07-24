// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import * as React from 'preact/compat';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/react-stripe-js';
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

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (paymentMethodId: string) => Promise<PaymentResult>,
  paymentFailure: (paymentError: ErrorReason) => Action,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: ((clientSecret: string | null) => void) => Action,
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
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised: (paymentMethodId: string) =>
    dispatch(onThirdPartyPaymentAuthorised({
      paymentMethod: Stripe,
      stripePaymentMethod: 'StripeCheckout',
      paymentMethodId,
    })),
  paymentFailure: (paymentError: ErrorReason) => dispatch(paymentFailure(paymentError)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: (clientSecret: string | null) => void) =>
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

const fieldStyle = {
  base: {
    fontFamily: '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
    fontSize: '16px',
    '::placeholder': {
      color: '#999999',
    },
    lineHeight: '24px',
  },
};

const renderVerificationCopy = (countryGroupId: CountryGroupId, contributionType: ContributionType) => {
  trackComponentLoad(`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`);
  return (<div className="form__error"> {'Please tick to verify you\'re a human'} </div>);
};

const errorMessageFromState = (state: CardFieldState): string | null =>
  (state.name === 'Error' ? state.errorMessage : null);

// TODO - utils?
const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const CardForm = (props: PropTypes) => {

  /**
   * State
   */
  const [currentlySelected, setCurrentlySelected] = React.useState<CardFieldName | null>(null);
  const [fieldStates, setFieldStates] = React.useState<{[CardFieldName]: CardFieldState}>({
    CardNumber: { name: 'Incomplete' },
    Expiry: { name: 'Incomplete' },
    CVC: { name: 'Incomplete' },
  });
  const stripe = stripeJs.useStripe();
  const elements = stripeJs.useElements();

  /**
   * Handlers
   */
  const onChange = (fieldName: CardFieldName) => (update) => {
    const newFieldState = () => {
      if (update.error) { return { name: 'Error', errorMessage: update.error.message }; }
      if (update.complete) { return { name: 'Complete' }; }
      return { name: 'Incomplete' };
    };

    setFieldStates({
      ...fieldStates,
      [fieldName]: newFieldState(),
    });
  };

  const handleStripeError = (errorData: any): void => {
    props.setPaymentWaiting(false);

    logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

    if (errorData.type === 'validation_error') {
      // This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
      // happen then display a generic error about card details
      props.paymentFailure('payment_details_incorrect');
    } else {
      // This is probably a Stripe or network problem
      props.paymentFailure('payment_provider_unavailable');
    }
  };

  // Creates a new setupIntent upon recaptcha verification
  const setupRecurringRecaptchaCallback = () => {
    window.grecaptcha.render('robot_checkbox', {
      sitekey: window.guardian.v2recaptchaPublicKey,
      callback: (token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        props.setStripeRecurringRecaptchaVerified(true);

        fetchJson(
          routes.stripeSetupIntentRecaptcha,
          requestOptions(
            { token, stripePublicKey: props.stripeKey },
            'same-origin',
            'POST',
            props.csrf,
          ),
        )
          .then((json) => {
            if (json.client_secret) {
              trackComponentLoad('contributions-recaptcha-verified');

              props.setStripeSetupIntentClientSecret(json.client_secret);
            } else {
              throw new Error(`Missing client_secret field in server response: ${JSON.stringify(json)}`);
            }
          })
          .catch((err) => {
            logException(`Error getting Setup Intent client_secret from ${routes.stripeSetupIntentRecaptcha}: ${err}`);
            props.paymentFailure('internal_error');
            props.setPaymentWaiting(false);
          });
      },
    });
  };

  const setupRecaptchaTokenForOneOff = () => {
    window.grecaptcha.render('robot_checkbox', {
      sitekey: window.guardian.v2recaptchaPublicKey,
      callback: (token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        props.setOneOffRecaptchaToken(token);
      },
    });
  };

  const setupOneOffHandlers = (): void => {
    if (window.guardian.recaptchaEnabled) {
      if (window.grecaptcha && window.grecaptcha.render) {
        setupRecaptchaTokenForOneOff();
      } else {
        window.v2OnloadCallback = setupRecaptchaTokenForOneOff;
      }
    }

    props.setCreateStripePaymentMethod(() => {
      props.setPaymentWaiting(true);

      const cardElement = elements.getElement(CardNumberElement);

      stripe.createPaymentMethod({ type: 'card', card: cardElement }).then((result) => {
        if (result.error) {
          handleStripeError(result.error);
        } else {
          props.onPaymentAuthorised(result.paymentMethod.id);
        }
      });
    });

    props.setHandleStripe3DS((clientSecret: string) => {
      trackComponentLoad('stripe-3ds');
      return stripe.handleCardAction(clientSecret);
    });
  };

  const handleCardSetupForRecurring = (clientSecret: string): void => {
    const cardElement = elements.getElement(CardNumberElement);
    stripe.handleCardSetup(clientSecret, cardElement).then((result) => {
      if (result.error) {
        handleStripeError(result.error);
      } else {
        props.onPaymentAuthorised(result.setupIntent.payment_method);
      }
    });
  };

  const setupRecurringHandlers = (): void => {
    // Start by requesting the client_secret for a new Payment Method.
    // Note - because this value is requested asynchronously when the component loads,
    // it's possible for it to arrive after the user clicks 'Contribute'.
    // This is handled in the callback below by checking the value of paymentWaiting.
    if (window.guardian.recaptchaEnabled) {
      if (window.grecaptcha && window.grecaptcha.render) {
        setupRecurringRecaptchaCallback();
      } else {
        window.v2OnloadCallback = setupRecurringRecaptchaCallback;
      }
    }

    props.setCreateStripePaymentMethod((clientSecret: string | null) => {
      props.setPaymentWaiting(true);

      // Post-deploy tests bypass recaptcha, and no verification happens server-side for the test Stripe account
      if (!window.guardian.recaptchaEnabled || props.postDeploymentTestUser) {
        fetchJson(
          routes.stripeSetupIntentRecaptcha,
          requestOptions(
            { token: 'post-deploy-token', stripePublicKey: props.stripeKey },
            'same-origin',
            'POST',
            props.csrf,
          ),
        )
          .then((json) => {
            if (json.client_secret) {
              handleCardSetupForRecurring(json.client_secret);
            } else {
              throw new Error(`Missing client_secret field in server response: ${JSON.stringify(json)}`);
            }
          });
      }

      /* Recaptcha verification is required for setupIntent creation.
      If setupIntentClientSecret is ready then complete the payment now.
      If setupIntentClientSecret is not ready then componentDidUpdate will complete the payment when it arrives. */
      if (clientSecret) {
        handleCardSetupForRecurring(clientSecret);
      }
    });
  };

  /**
   * Hooks
   */

  React.useEffect(() => {
    if (stripe && elements) {
      if (props.contributionType === 'ONE_OFF') {
        setupOneOffHandlers();
      } else {
        setupRecurringHandlers();
      }
    }
  }, [stripe, elements, props.contributionType]);

  // If we have just received the setupIntentClientSecret and the user has already clicked 'Contribute'
  // then go ahead and process the recurring contribution
  const previousSetupIntentClientSecret = usePrevious(props.setupIntentClientSecret);
  React.useEffect(() => {
    const clientSecretHasUpdated = !previousSetupIntentClientSecret && props.setupIntentClientSecret;
    if (props.paymentWaiting && clientSecretHasUpdated && props.setupIntentClientSecret) {
      handleCardSetupForRecurring(props.setupIntentClientSecret);
    }
  }, [props.setupIntentClientSecret]);

  React.useEffect(() => {
    const formIsComplete =
      fieldStates.CardNumber.name === 'Complete' &&
      fieldStates.Expiry.name === 'Complete' &&
      fieldStates.CVC.name === 'Complete';

    if (formIsComplete) {
      props.setStripeCardFormComplete(formIsComplete);
    }
  }, [fieldStates]);

  /**
   * Rendering
   * TODO - DESIGN SYSTEM
   */

  const fieldError: ?string =
    errorMessageFromState(fieldStates.CardNumber) ||
    errorMessageFromState(fieldStates.Expiry) ||
    errorMessageFromState(fieldStates.CVC);

  const incompleteMessage = (): ?string => {
    if (
      props.checkoutFormHasBeenSubmitted &&
      (
        fieldStates.CardNumber.name === 'Incomplete' ||
        fieldStates.Expiry.name === 'Incomplete' ||
        fieldStates.CVC.name === 'Incomplete'
      )
    ) {
      return 'Please complete your card details';
    }
    return undefined;
  };

  const errorMessage: ?string = fieldError || incompleteMessage();

  const getFieldBorderClass = (fieldName: CardFieldName): string => {
    if (currentlySelected === fieldName) {
      return 'form__input-enabled';
    } else if (fieldStates[fieldName].name === 'Error') {
      return 'form__input--invalid';
    }
    return '';
  };

  const getClasses = (fieldName: CardFieldName): string =>
    `form__input ${getFieldBorderClass(fieldName)}`;

  const showCards = (country: IsoCountry) => {
    if (country === 'US') {
      return <CreditCardsUS className="form__credit-card-icons" />;
    }
    return <CreditCardsROW className="form__credit-card-icons" />;
  };

  const recaptchaVerified =
    props.contributionType === 'ONE_OFF' ?
      props.oneOffRecaptchaToken : props.recurringRecaptchaVerified;

  return (
    <div className="form__fields">
      <legend className="form__legend"><h3>Your card details</h3></legend>
      <div className="form__field">
        <label className="form__label" htmlFor="stripeCardNumberElement">
          <span>Card number</span>
        </label>
        {showCards(props.country)}
        <span className={getClasses('CardNumber')}>
          <CardNumberElement
            id="stripeCardNumberElement"
            style={fieldStyle}
            onChange={onChange('CardNumber')}
            onFocus={() => setCurrentlySelected('CardNumber')}
            onBlur={setCurrentlySelected(null)}
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
              style={fieldStyle}
              onChange={onChange('Expiry')}
              onFocus={() => setCurrentlySelected('Expiry')}
              onBlur={setCurrentlySelected(null)}
            />
          </span>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="stripeCardCVCElement">
            <span>CVC</span>
          </label>
          <span className={getClasses('CVC')}>
            <CardCvcElement
              id="stripeCardCVCElement"
              style={fieldStyle}
              placeholder=""
              onChange={onChange('CVC')}
              onFocus={() => setCurrentlySelected('CVC')}
              onBlur={setCurrentlySelected(null)}
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
            props.checkoutFormHasBeenSubmitted
            && !recaptchaVerified ?
              renderVerificationCopy(props.countryGroupId, props.contributionType) : null
          }
        </div>
        : null }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
