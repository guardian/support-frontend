import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getSanitisedHtml } from 'helpers/utilities/utilities';
import type { StudentDiscount } from '../helpers/discountDetails';
import StudentHeader from './StudentHeader';
import { universityBadge } from './StudentHeaderStyles';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageInstitution({
	landingPageVariant,
	studentLandingPageVariant,
	supportRegionId,
	productKey,
	ratePlanKey,
	studentDiscount,
}: {
	landingPageVariant: LandingPageVariant;
	studentLandingPageVariant: StudentLandingPageVariant;
	supportRegionId: SupportRegionId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	studentDiscount: StudentDiscount;
}) {
	const sanitisedHTMLHeading = getSanitisedHtml(
		studentLandingPageVariant.heading,
	);
	const sanitisedHTMLSubHeading = getSanitisedHtml(
		studentLandingPageVariant.subheading,
	);
	const sanitisedHTMLInstAcronym = getSanitisedHtml(
		studentLandingPageVariant.institution.acronym,
	);

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
					headingCopy={<>{sanitisedHTMLHeading}</>}
					subheadingCopy={
						<>
							{sanitisedHTMLSubHeading}
							{studentDiscount.promoDuration && (
								<>
									, <strong>free for {studentDiscount.promoDuration}</strong>
								</>
							)}
							.
						</>
					}
					universityBadge={
						<p css={universityBadge}>
							<img
								src={studentLandingPageVariant.institution.logoUrl}
								alt="logo"
							/>{' '}
							<span>Special offer for {sanitisedHTMLInstAcronym} students</span>
						</p>
					}
					heroImagePrefix="AuStudentLandingHero"
				/>
			}
		/>
	);
}
