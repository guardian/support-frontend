import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { StudentLandingPageGlobal } from './components/StudentLandingPageGlobal';
import { getStudentDiscount } from './helpers/discountDetails';

export function StudentLandingPageGlobalContainer({
	supportRegionId,
	landingPageVariant,
}: {
	supportRegionId: SupportRegionId;
	landingPageVariant: LandingPageVariant;
}) {
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'OneYearStudent';

	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
		undefined, // Promo code not needed here - discount is applied by the rate plan
	);

	return (
		<>
			{studentDiscount && (
				<StudentLandingPageGlobal
					supportRegionId={supportRegionId}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					landingPageVariant={landingPageVariant}
					studentDiscount={studentDiscount}
				/>
			)}
		</>
	);
}
