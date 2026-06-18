import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { isGuardianWeeklyDigitalProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

interface OrderSummaryStartDateProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	startDate: string;
}
export function OrderSummaryStartDate({
	productKey,
	ratePlanKey,
	startDate,
}: OrderSummaryStartDateProps): JSX.Element | null {
	if (isGuardianWeeklyDigitalProduct(productKey, ratePlanKey)) {
		return (
			<p>
				Your first issue of Guardian Weekly will be {startDate}. Please allow 1
				to 7 days after your start date for your magazine to arrive, depending
				on national post services. Your digital benefits will start today.
			</p>
		);
	}
	return null;
}
