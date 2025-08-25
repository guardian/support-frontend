import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { type GeoId } from 'pages/geoIdConfig';
import type { StudentDiscount } from '../helpers/discountDetails';
import StudentHeader from './StudentHeader';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageGlobal({
	geoId,
	landingPageVariant,
	productKey,
	ratePlanKey,
	studentDiscount,
}: {
	geoId: GeoId;
	landingPageVariant: LandingPageVariant;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	studentDiscount: StudentDiscount;
}) {
	return (
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
	);
}
