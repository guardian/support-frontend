import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { type GeoId } from 'pages/geoIdConfig';
import { StudentLandingPageGlobal } from './components/StudentLandingPageGlobal';
import { getStudentDiscount } from './helpers/discountDetails';

export function StudentLandingPageGlobalContainer({
	geoId,
	landingPageVariant,
}: {
	geoId: GeoId;
	landingPageVariant: LandingPageVariant;
}) {
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'OneYearStudent';

	const studentDiscount = getStudentDiscount(
		geoId,
		ratePlanKey,
		productKey,
		undefined, // Promo code not needed here - discount is applied by the rate plan
	);

	return (
		<>
			{studentDiscount && (
				<StudentLandingPageGlobal
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
