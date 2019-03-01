// @flow
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { getFormFields } from './digitalSubscriptionCheckoutReducer';
import { postRegularPaymentRequest } from '../../helpers/paymentIntegrations/readerRevenueApis';
import trackConversion from '../../helpers/tracking/conversions';
import type { ErrorReason } from '../../helpers/errorReasons';
