import type { IsoCountry } from '@modules/internationalisation/country';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { type GeoId } from 'pages/geoIdConfig';
import { getStudentDiscount } from './helpers/discountDetails';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageContainer({
	geoId,
	productKey,
	ratePlanKey,
	landingPageVariant,
}: {
	geoId: GeoId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	landingPageVariant: LandingPageVariant;
}) {
	/**
	 * Non-AU Students have ratePlanKey as OneYearStudent
	 * AU Students have ratePlanKey as Monthly, productKey as SupporterPlus
	 * and optional promoCode
	 */
	const countryId: IsoCountry = Country.detect();
	const promotionSupporterPlus = getPromotion(
		allProductPrices.SupporterPlus,
		countryId,
		ratePlanToBillingPeriod(ratePlanKey),
	);
	const studentDiscount = getStudentDiscount(
		geoId,
		ratePlanKey,
		productKey,
		promotionSupporterPlus,
	);

	return (
		<>
			{studentDiscount && (
				<StudentLandingPage
					geoId={geoId}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					landingPageVariant={landingPageVariant}
					studentDiscount={studentDiscount}
				/>
			)}
		</>
	);
}
