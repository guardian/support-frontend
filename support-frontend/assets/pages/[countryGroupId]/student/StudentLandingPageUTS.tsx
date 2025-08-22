import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { type GeoId } from 'pages/geoIdConfig';
import StudentHeader from './components/StudentHeader';
import { universityBadge } from './components/StudentHeaderStyles';
import type { StudentDiscount } from './helpers/discountDetails';
import LogoUTS from './logos/uts';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageUTS({
	landingPageVariant,
	geoId,
	productKey,
	ratePlanKey,
	studentDiscount,
}: {
	landingPageVariant: LandingPageVariant;
	geoId: GeoId;
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
					headingCopy="Subscribe to fearless, independent and inspiring journalism"
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
				/>
			}
		/>
	);
}
