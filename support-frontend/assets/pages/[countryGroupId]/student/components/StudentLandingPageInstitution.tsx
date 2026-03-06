import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { StudentDiscount } from '../helpers/discountDetails';
import LogoUTS from '../logos/uts';
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
					headingCopy={studentLandingPageVariant.heading}
					subheadingCopy={
						<>
							For a limited time, students with a valid UTS email address can
							unlock the premium experience of Guardian journalism, including
							unmetered app access
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
							<LogoUTS /> <span>Special offer for UTS students</span>
						</p>
					}
					heroImagePrefix="AuStudentLandingHero"
				/>
			}
		/>
	);
}
