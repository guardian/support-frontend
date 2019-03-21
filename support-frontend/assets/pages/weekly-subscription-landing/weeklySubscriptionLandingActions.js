// @flow

// ----- Imports ----- //

import { type WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';

// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<WeeklyBillingPeriod>('GuardianWeekly', 'GuardianWeekly');

function redirectToWeeklyPage() {}


// ----- Exports ----- //

export { setPlan, redirectToWeeklyPage };
