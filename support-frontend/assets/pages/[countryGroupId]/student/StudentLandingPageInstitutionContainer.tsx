import type { IsoCountry } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
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
