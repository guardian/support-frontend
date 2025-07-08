import { BillingPeriod } from '@modules/product/billingPeriod';
import { Container } from 'components/layout/container';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { GeoId } from 'pages/geoIdConfig';
import getProductContents from '../helpers/getProductContents';
import LogoUTS from '../logos/uts';
import {
	cardContainer,
	containerCardsAndSignIn,
	heading,
	headingWrapper,
	subHeading,
	universityBadge,
} from './StudentHeaderStyles';
import StudentProductCard from './StudentProductCard';

export default function StudentHeader({
	geoId,
	landingPageVariant,
}: {
	geoId: GeoId;
	landingPageVariant: LandingPageVariant;
}) {
	const productContent = getProductContents(geoId, landingPageVariant);
	return (
		<Container
			sideBorders
			topBorder
			borderColor="rgba(170, 170, 180, 0.5)"
			cssOverrides={containerCardsAndSignIn}
		>
			<p css={universityBadge}>
				<LogoUTS /> <span>Special offer for UTS students</span>
			</p>
			<div css={headingWrapper}>
				<h1 css={heading}>
					Subscribe to fearless, independent and inspiring journalism
				</h1>
				<p css={subHeading}>
					For a limited time, students with a valid UTS email address can unlock
					the premium experience of Guardian journalism, including unmetered app
					access, free for 2 years.
				</p>
			</div>
			<div css={cardContainer}>
				<StudentProductCard
					cardTier={1}
					promoCount={0}
					isSubdued={false}
					currencyId={'AUD'}
					billingPeriod={BillingPeriod.Annual}
					cardContent={productContent}
				/>
			</div>
		</Container>
	);
}
