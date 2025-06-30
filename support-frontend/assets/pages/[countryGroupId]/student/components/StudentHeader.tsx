import { BillingPeriod } from '@modules/product/billingPeriod';
import { Container } from 'components/layout/container';
import type { GeoId } from 'pages/geoIdConfig';
import getProductContents from '../helpers/getProductContents';
import LogoUTS from '../logos/uts';
import {
	cardcontainer,
	containerCardsAndSignIn,
	headingWrapper,
	subheading,
	universityBadge,
} from './StudentHeaderStyles';
import StudentProductCard from './StudentProductCard';
import { heading } from './StudentProductCardStyles';

export default function StudentHeader({ geoId }: { geoId: GeoId }) {
	const productContent = getProductContents(geoId);
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
				<p css={subheading}>
					For a limited time, students with a valid UTS email address can unlock
					the premium experience of Guardian journalism, including unmetered app
					access, free for 2 years.
				</p>
			</div>
			<div css={cardcontainer}>
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
