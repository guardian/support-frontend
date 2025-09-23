import type { IsoCountry } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { StudentLandingPageUTS } from './components/StudentLandingPageUTS';
import { getStudentDiscount } from './helpers/discountDetails';

export function StudentLandingPageUTSContainer({
	landingPageVariant,
}: {
	landingPageVariant: LandingPageVariant;
}) {
	const supportRegionId = SupportRegionId.AU;
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';

	const countryId: IsoCountry = Country.detect();
	const maybePromo = getPromotion(
		allProductPrices.SupporterPlus,
		countryId,
		ratePlanToBillingPeriod(ratePlanKey),
	);
	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
		maybePromo,
	);

	return (
		<>
			{studentDiscount && (
				<StudentLandingPageUTS
					supportRegionId={supportRegionId}
					landingPageVariant={landingPageVariant}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					studentDiscount={studentDiscount}
				/>
			)}
		</>
	);
}
