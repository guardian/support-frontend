import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { StudentDiscount } from '../helpers/discountDetails';
import { StudentBrandAwareness } from './StudentBrandAwareness';
import StudentHeader from './StudentHeader';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageGlobal({
	supportRegionId,
	landingPageVariant,
	productKey,
	ratePlanKey,
	studentDiscount,
}: {
	supportRegionId: SupportRegionId;
	landingPageVariant: LandingPageVariant;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	studentDiscount: StudentDiscount;
}) {
	return (
		<StudentLandingPage
			supportRegionId={supportRegionId}
			header={
				<StudentHeader
					supportRegionId={supportRegionId}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					landingPageVariant={landingPageVariant}
					studentDiscount={studentDiscount}
					headingCopy={
						<>
							<p>No owner. No agenda.</p>
							<p>
								No more than {studentDiscount.discountPriceWithCurrency} a year
								for students
							</p>
						</>
					}
					subheadingCopy="Now more than ever, independent journalism matters. Get fact-based reporting you can trust and unlimited access to the Guardian apps &mdash; without breaking your budget."
					includeThreeTierLink={true}
					heroImagePrefix="globalStudentLandingHero"
				/>
			}
			brandAwareness={<StudentBrandAwareness />}
		/>
	);
}
