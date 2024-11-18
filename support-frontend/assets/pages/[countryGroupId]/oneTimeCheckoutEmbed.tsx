import {css, ThemeProvider} from '@emotion/react';
import {
  from,
  neutral,
  space,
  textSans17,
} from '@guardian/source/foundations';
import {
  buttonThemeReaderRevenueBrand,
  LinkButton,
} from '@guardian/source/react-components';
import {
  Divider,
  ErrorSummary,
} from '@guardian/source-development-kitchen/react-components';
import {
  Elements,
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PriceCards } from 'components/priceCards/priceCards';
import {
  init as abTestInit,
  getAmountsTestVariant,
} from 'helpers/abTests/abtest';
import { config } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import {
  processStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
  CreatePayPalPaymentResponse,
  CreateStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
  PaymentResult,
  StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { getStripeKey } from 'helpers/forms/stripe';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import * as cookie from 'helpers/storage/cookie';
import {
  derivePaymentApiAcquisitionData,
  getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {trackComponentClick, trackComponentLoad} from 'helpers/tracking/behaviour';
import {
  sendEventOneTimeCheckoutValue,
  sendEventPaymentMethodSelected,
} from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import { roundToDecimalPlaces } from 'helpers/utilities/utilities';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { FinePrint } from 'pages/supporter-plus-landing/components/finePrint';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { TsAndCsFooterLinks } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import {countryGroups} from "../../helpers/internationalisation/countryGroup";
import {EmbedCheckoutLayout} from "./components/embedCheckoutLayout";
import { shorterBoxMargin } from './components/form';
import { setThankYouOrder } from './components/thankyou';
import {
  preventDefaultValidityMessage,
} from './validation';

type PaymentMethod = 'StripeExpressCheckoutElement';
const countryId = Country.detect();

const standFirst = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[3]}px;
`;

const tcContainer = css`
	color: ${neutral[20]};
	& a {
		color: ${neutral[20]};
	}
`;

type OneTimeCheckoutProps = {
  geoId: GeoId;
  appConfig: AppConfig;
};

type OneTimeCheckoutComponentProps = OneTimeCheckoutProps & {
  stripePublicKey: string;
  isTestUser: boolean;
};

function getPreSelectedAmount(
  preSelectedAmountParam: string | null,
  amountChoices: number[],
): {
  preSelectedOtherAmount?: string;
  preSelectedPriceCard?: number | 'other';
} {
  const preSelectedAmount = preSelectedAmountParam
    ? parseInt(preSelectedAmountParam, 10)
    : undefined;

  if (preSelectedAmount === undefined) {
    return {
      preSelectedOtherAmount: undefined,
      preSelectedPriceCard: undefined,
    };
  }

  const preSelectedPriceCard = amountChoices.includes(preSelectedAmount)
    ? preSelectedAmount
    : 'other';

  return {
    preSelectedOtherAmount: preSelectedAmount.toString(),
    preSelectedPriceCard,
  };
}

function getFinalAmount(
  selectedPriceCard: number | 'other',
  otherAmount: string,
  minAmount: number,
): number | undefined {
  if (selectedPriceCard === 'other') {
    const parsedAmount = parseFloat(otherAmount);
    return Number.isNaN(parsedAmount) || parsedAmount < minAmount
      ? undefined
      : roundToDecimalPlaces(parsedAmount );
  }
  return roundToDecimalPlaces(selectedPriceCard );
}

export function OneTimeCheckoutEmbed({ geoId, appConfig }: OneTimeCheckoutProps) {
  const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
  const isTestUser = !!cookie.get('_test_username');

  const stripePublicKey = getStripeKey(
    'ONE_OFF',
    countryId,
    currencyKey,
    isTestUser,
  );

  const stripePromise = loadStripe(stripePublicKey);

  const minAmount = config[countryGroupId]['ONE_OFF'].min;
  const elementsOptions = {
    mode: 'payment',
    /**
     * Stripe amounts are in the "smallest currency unit"
     * @see https://docs.stripe.com/api/charges/object
     * @see https://docs.stripe.com/currencies#zero-decimal
     */
    amount: minAmount * 100,
    currency: currencyKey.toLowerCase(),
    paymentMethodCreation: 'manual',
  } as const;

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <OneTimeCheckoutEmbedComponent
        geoId={geoId}
        appConfig={appConfig}
        stripePublicKey={stripePublicKey}
        isTestUser={isTestUser}
      />
    </Elements>
  );
}

function OneTimeCheckoutEmbedComponent({
                                    geoId,
                                    appConfig,
                                    stripePublicKey,
                                  }: OneTimeCheckoutComponentProps) {
  const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);
  const urlSearchParams = new URLSearchParams(window.location.search);

  const preSelectedAmountParam = urlSearchParams.get('contribution');

  const user = appConfig.user;

  const settings = getSettings();
  const { selectedAmountsVariant } = getAmountsTestVariant(
    countryId,
    countryGroupId,
    settings,
  );

  const abParticipations = abTestInit({ countryId, countryGroupId });

  const { amountsCardData } = selectedAmountsVariant;
  const { amounts, defaultAmount, hideChooseYourAmount } =
    amountsCardData['ONE_OFF'];

  const { preSelectedPriceCard, preSelectedOtherAmount } = getPreSelectedAmount(
    preSelectedAmountParam,
    amounts,
  );

  const minAmount = config[countryGroupId]['ONE_OFF'].min;

  const [selectedPriceCard, setSelectedPriceCard] = useState<number | 'other'>(
    preSelectedPriceCard ?? defaultAmount,
  );

  const [otherAmount, setOtherAmount] = useState<string>(
    preSelectedOtherAmount ?? '',
  );

  const [otherAmountError, setOtherAmountError] = useState<string>();

  const finalAmount = getFinalAmount(
    selectedPriceCard,
    otherAmount,
    minAmount,
  );

  useEffect(() => {
    if (finalAmount) {
      // valid final amount, set amount, enable Express checkout
      elements?.update({ amount: finalAmount * 100 });
      setStripeExpressCheckoutEnable(true);

      // Track amount selection with QM
      sendEventOneTimeCheckoutValue(finalAmount, currencyKey);
    } else {
      // invalid final amount, disable Express checkout
      setStripeExpressCheckoutEnable(false);
    }
  }, [finalAmount]);

  /** Payment methods: Stripe */
  const stripe = useStripe();
  const elements = useElements();
  const [
    stripeExpressCheckoutPaymentType,
    setStripeExpressCheckoutPaymentType,
  ] = useState<ExpressPaymentType>();
  const stripePaymentMethod: StripePaymentMethod =
    stripeExpressCheckoutPaymentType === 'apple_pay'
      ? 'StripeApplePay'
      : 'StripePaymentRequestButton';

  const [stripeExpressCheckoutSuccessful, setStripeExpressCheckoutSuccessful] =
    useState(false);
  const [stripeExpressCheckoutReady, setStripeExpressCheckoutReady] =
    useState(false);
  const [stripeExpressCheckoutEnable, setStripeExpressCheckoutEnable] =
    useState(false);
  useEffect(() => {
    if (stripeExpressCheckoutSuccessful) {
      formRef.current?.requestSubmit();
    }
  }, [stripeExpressCheckoutSuccessful]);

  /** Recaptcha */
  const [recaptchaToken] = useState<string>();

  /** Personal details **/
  const [email, setEmail] = useState(user?.email ?? '');

  const [billingPostcode] = useState('');


  /** General error that can occur via fetch validations */
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorContext, setErrorContext] = useState<string>();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('None');

  const formRef = useRef<HTMLFormElement>(null);

  const validate = (
    event: React.FormEvent<HTMLInputElement>,
    setAction: React.Dispatch<React.SetStateAction<string | undefined>>,
    missing: string,
    invalid?: string,
  ) => {
    preventDefaultValidityMessage(event.currentTarget); // prevent default browser error message
    const validityState = event.currentTarget.validity;
    if (validityState.valid) {
      setAction(undefined); // clear error
    } else {
      if (validityState.valueMissing) {
        setAction(missing); // required
      } else {
        setAction(invalid ?? ' '); // pattern mismatch
      }
    }
  };

  const formOnSubmit = async () => {
    if (finalAmount) {
      setIsProcessingPayment(true);

      let paymentResult;


        const paymentMethodResult = await stripe.createPaymentMethod({
          elements,
        });

        if (paymentMethodResult.error) {
          logException(
            `Error creating Payment Method: ${JSON.stringify(
              paymentMethodResult.error,
            )}`,
          );

          if (paymentMethodResult.error.type === 'validation_error') {
            setErrorMessage('There was an issue with your card details.');
            setErrorContext(
              appropriateErrorMessage('payment_details_incorrect'),
            );
          } else {
            setErrorMessage('Sorry, something went wrong.');
            setErrorContext(
              appropriateErrorMessage('payment_provider_unavailable'),
            );
          }
        } else {
          const stripeData: CreateStripePaymentIntentRequest = {
            paymentData: {
              currency: currencyKey,
              amount: finalAmount,
              email,
              stripePaymentMethod: stripePaymentMethod,
            },
            acquisitionData: derivePaymentApiAcquisitionData(
              {
                ...getReferrerAcquisitionData(),
                labels: ['one-time-checkout'],
              },
              abParticipations,
              billingPostcode,
            ),
            publicKey: stripePublicKey,
            recaptchaToken: recaptchaToken ?? '',
            paymentMethodId: paymentMethodResult.paymentMethod.id,
          };
          paymentResult = await processStripePaymentIntentRequest(
            stripeData,
            (clientSecret: string) => {
              trackComponentLoad('stripe-3ds');
              return stripe.handleCardAction(clientSecret);
            },
          );
      }

      if (paymentResult) {
        setThankYouOrder({
          firstName: '',
          email: email,
          paymentMethod: paymentMethod,
        });
        const thankYouUrlSearchParams = new URLSearchParams();
        thankYouUrlSearchParams.set('contribution', finalAmount.toString());
        const nextStepRoute = paymentResultThankyouRoute(
          paymentResult,
          geoId,
          thankYouUrlSearchParams,
        );
        if (nextStepRoute) {
          window.location.href = nextStepRoute;
        } else {
          setErrorMessage('Sorry, something went wrong.');
          if (
            'paymentStatus' in paymentResult &&
            paymentResult.paymentStatus === 'failure'
          ) {
            setErrorContext(appropriateErrorMessage(paymentResult.error ?? ''));
          }
        }
      } else {
        setIsProcessingPayment(false);
      }
    }
  };

  function paymentResultThankyouRoute(
    paymentResult: PaymentResult | CreatePayPalPaymentResponse | undefined,
    geoId: GeoId,
    thankYouUrlSearchParams: URLSearchParams,
  ): string | undefined {
    if (paymentResult) {
      if ('type' in paymentResult && paymentResult.type === 'success') {
        return paymentResult.data.approvalUrl;
      } else if (
        'paymentStatus' in paymentResult &&
        paymentResult.paymentStatus === 'success'
      ) {
        return `/${geoId}/thank-you?${thankYouUrlSearchParams.toString()}`;
      }
    }

    return;
  }
  const paymentButtonText =
     `Support us with ${simpleFormatAmount(currency, finalAmount)}`

  return (
    <EmbedCheckoutLayout>
      <Box>
        <BoxContents>
          <div
            css={css`
							${textSans17}
						`}
          >
            <p css={standFirst}>Support us with the amount of your choice.</p>
            <PriceCards
              amounts={amounts}
              selectedAmount={selectedPriceCard}
              currency={currencyKey}
              onAmountChange={(amount: string) => {
                setSelectedPriceCard(
                  amount === 'other' ? amount : Number.parseFloat(amount),
                );
              }}
              hideChooseYourAmount={hideChooseYourAmount}
              otherAmountField={
                <OtherAmount
                  currency={currencyKey}
                  minAmount={minAmount}
                  selectedAmount={selectedPriceCard}
                  otherAmount={otherAmount}
                  onBlur={(event) => {
                    event.target.checkValidity(); // loose focus, onInvalid check fired
                  }}
                  onOtherAmountChange={setOtherAmount}
                  errors={[otherAmountError ?? '']}
                  onInvalid={(event) => {
                    validate(
                      event,
                      setOtherAmountError,
                      'Please enter an amount.',
                    );
                  }}
                />
              }
            />
          </div>
        </BoxContents>
      </Box>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          /** we defer this to an external function as a lot of the payment methods use async */
          void formOnSubmit();

          return false;
        }}
      >
        <Box cssOverrides={shorterBoxMargin}>
          <BoxContents>
            <div
              css={css`
								/* Prevent content layout shift */
								min-height: 8px;
							`}
            >
              <ExpressCheckoutElement
                onReady={({ availablePaymentMethods }) => {
                  /**
                   * This is use to show UI needed besides this Element
                   * i.e. The "or" divider
                   */
                  if (
                    !!availablePaymentMethods?.applePay ||
                    !!availablePaymentMethods?.googlePay
                  ) {
                    setStripeExpressCheckoutReady(true);
                  }
                }}
                onClick={({ resolve }) => {
                  /** @see https://docs.stripe.com/elements/express-checkout-element/accept-a-payment?locale=en-GB#handle-click-event */
                  if (stripeExpressCheckoutEnable) {
                    const options = {
                      emailRequired: true,
                    };

                    // Track payment method selection with QM
                    sendEventPaymentMethodSelected(
                      'StripeExpressCheckoutElement',
                    );

                    resolve(options);
                  }
                }}
                onConfirm={async (event) => {

                  if (!stripe || !elements) {
                    console.error('Stripe not loaded');
                    return;
                  }

                  const { error: submitError } = await elements.submit();

                  if (submitError) {
                    setErrorMessage(submitError.message);
                    return;
                  }

                  // ->

                  setPaymentMethod('StripeExpressCheckoutElement');
                  setStripeExpressCheckoutPaymentType(event.expressPaymentType);
                  event.billingDetails?.email &&
                  setEmail(event.billingDetails.email);

                  /**
                   * There is a useEffect that listens to this and submits the form
                   * when true
                   */
                  setStripeExpressCheckoutSuccessful(true);
                }}
                options={{
                  paymentMethods: {
                    applePay: 'auto',
                    googlePay: 'always',
                    link: 'never',
                  },
                }}
              />

              {stripeExpressCheckoutReady && (
                <Divider
                  displayText="or"
                  size="full"
                  cssOverrides={css`
										::before {
											margin-left: 0;
										}
										::after {
											margin-right: 0;
										}
										margin: 0;
										margin-top: 14px;
										margin-bottom: 14px;
										width: 100%;
										@keyframes fadeIn {
											0% {
												opacity: 0;
											}
											100% {
												opacity: 1;
											}
										}
										animation: fadeIn 1s;
									`}
                />
              )}
            </div>

              <ThemeProvider theme={buttonThemeReaderRevenueBrand}>
                <LinkButton
                  cssOverrides={btnStyleOverrides}
                  onClick={() => {
                    const url = `/${
                      countryGroups[countryGroupId].supportInternationalisationId
                    }/contribute/checkout?selected-contribution-type=one_off&selected-amount=${
                      selectedPriceCard === 'other' ? otherAmount : selectedPriceCard
                    }`;

                    trackComponentClick(
                      `npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
                    );
                    window.open(url, '_blank');
                  }}
                >
                  {paymentButtonText}
                </LinkButton>
              </ThemeProvider>

            {errorMessage && (
              <div role="alert" data-qm-error>
                <ErrorSummary
                  cssOverrides={css`
										margin-bottom: ${space[6]}px;
									`}
                  message={errorMessage}
                  context={errorContext}
                />
              </div>
            )}
            <div css={tcContainer}>
              <FinePrint mobileTheme={'dark'}>
                <TsAndCsFooterLinks countryGroupId={countryGroupId} />
              </FinePrint>
            </div>
          </BoxContents>
        </Box>
      </form>
      <PatronsMessage countryGroupId={countryGroupId} mobileTheme={'light'} />
      <GuardianTsAndCs mobileTheme={'light'} displayPatronsCheckout={false} />
      {isProcessingPayment && (
        <LoadingOverlay>
          <p>Processing transaction</p>
          <p>Please wait</p>
        </LoadingOverlay>
      )}
    </EmbedCheckoutLayout>
  );
}
