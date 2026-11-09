import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import { getQueryParameter } from 'helpers/urls/url';
import { StudentLandingPageInstitution } from './components/StudentLandingPageInstitution';
import { getStudentDiscount } from './helpers/discountDetails';

export function StudentLandingPageInstitutionContainer({
	landingPageVariant,
	studentLandingPageVariant,
	supportRegionId,
}: {
	landingPageVariant: LandingPageVariant;
	studentLandingPageVariant: StudentLandingPageVariant;
	supportRegionId: SupportRegionId;
}) {
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';

	const maybePromo = getAppliedPromotion(
		window.guardian.promotions ?? [],
		productKey,
		ratePlanKey,
		getQueryParameter('promoCode'),
	);

	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
		false, // allow institutions
		maybePromo,
	);

	return (
		<>
			{studentDiscount && (
				<StudentLandingPageInstitution
					supportRegionId={supportRegionId}
					landingPageVariant={landingPageVariant}
					studentLandingPageVariant={studentLandingPageVariant}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					studentDiscount={studentDiscount}
				/>
			)}
		</>
	);
}
