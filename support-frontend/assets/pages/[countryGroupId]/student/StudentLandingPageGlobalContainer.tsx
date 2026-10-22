import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { useStudentBeansRegionValid } from '../helpers/useStudentBeansRegionValid';
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

	const excludeAustralianInstitutions = useStudentBeansRegionValid(
		supportRegionId,
		Country.detect(),
	);
	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
		excludeAustralianInstitutions, // excludes Australian institutions when switch enableStudentBeansEurope On
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
