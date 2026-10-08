import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getLegacyPromotion } from 'helpers/productPrice/legacyPromotion';
import { getQueryParameter } from 'helpers/urls/url';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
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

	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const price =
		productCatalog[productKey]?.ratePlans[ratePlanKey]?.pricing[currencyKey];
	const maybePromo =
		price === undefined
			? undefined
			: getLegacyPromotion({
					promotions: window.guardian.promotions ?? [],
					productKey,
					ratePlanKey,
					price,
					billingPeriod: BillingPeriod.Monthly,
					promoCode: getQueryParameter('promoCode'),
			  });

	const studentDiscount = getStudentDiscount(
		supportRegionId,
		ratePlanKey,
		productKey,
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
