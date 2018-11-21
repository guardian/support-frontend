// @flow

// ----- Imports ----- //

import { type PaperBillingPeriod } from 'helpers/subscriptions';
import { productPagePeriodFormActionsFor } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';

// ----- Action Creators ----- //

const { setPeriod } = productPagePeriodFormActionsFor<PaperBillingPeriod>('Paper', 'Paper');

// ----- Exports ----- //

export { setPeriod };
