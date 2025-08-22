import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { type GeoId } from 'pages/geoIdConfig';
import StudentHeader from './components/StudentHeader';
import { getStudentDiscount } from './helpers/discountDetails';
import { StudentLandingPage } from './StudentLandingPage';

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
				<StudentLandingPage
					geoId={geoId}
					header={
						<StudentHeader
							geoId={geoId}
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							landingPageVariant={landingPageVariant}
							studentDiscount={studentDiscount}
							headingCopy={`No owner. No agenda. No more than ${studentDiscount.discountPriceWithCurrency} a year for students`}
							subheadingCopy="Now more than ever, independent journalism matters. Get fact-based reporting you can trust and unlimited access to the Guardian apps &mdash; without breaking your budget."
						/>
					}
				/>
			)}
		</>
	);
}
