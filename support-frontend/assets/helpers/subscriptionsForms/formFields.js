// @flow

import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import type { PaymentMethod } from 'helpers/paymentMethods';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { ReduxState } from 'helpers/page/page';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import type { State as AddressState } from 'components/subscriptionCheckouts/address/addressFieldsStore';

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

export type FormFields = {|
  title: Option<Title>,
  firstName: string,
  lastName: string,
  email: string,
  telephone: Option<string>,
  billingPeriod: BillingPeriod,
  paymentMethod: Option<PaymentMethod>,
  startDate: Option<string>,
  billingAddressIsSame: Option<boolean>,
|};

export type FormField = $Keys<FormFields>;

export type CheckoutState = {|
  stage: Stage,
  ...FormFields,
  email: string,
  formErrors: FormError<FormField>[],
  submissionError: Option<ErrorReason>,
  formSubmitted: boolean,
  isTestUser: boolean,
  productPrices: ProductPrices,
  payPalHasLoaded: boolean,
|};

export type State = ReduxState<{|
  checkout: CheckoutState,
  csrf: CsrfState,
  marketingConsent: MarketingConsentState,
  deliveryAddress: AddressState,
  billingAddress: AddressState,
|}>;
