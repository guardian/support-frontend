import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold42,
	palette,
	space,
	textSans17,
	textSansBold17,
} from '@guardian/source/foundations';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { Container } from 'components/layout/container';
import type { GeoId } from 'pages/geoIdConfig';
import getProductContents from '../helpers/getProduct';
import LogoUTS from '../logos/uts';
import StudentProductCard from './StudentProductCard';

const containerCardsAndSignIn = css`
	background-color: ${palette.brand[400]};
	> div {
		position: relative;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding: ${space[8]}px 10px 0px;
		${from.tablet} {
			align-items: center;
		}
	}
`;

const headingWrapper = css`
	color: ${palette.neutral[100]};
	margin-top: ${space[1]}px;
	${from.tablet} {
		text-align: center;
		max-width: 468px;
	}
	${from.desktop} {
		max-width: 740px;
	}
`;

const heading = css`
	${headlineBold28}
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		font-size: ${headlineBold42};
	}
`;

const subheading = css`
	${textSans17}
`;

const universityBadge = css`
	${textSansBold17}
	color: ${palette.neutral[100]};
	background-color: rgba(255, 255, 255, 0.15);
	padding: ${space[1]}px ${space[2]}px;
	display: flex;
	align-items: center;
	border-radius: ${space[1]}px;
	> span {
		border-left: 1px solid ${palette.neutral[100]};
		margin-left: ${space[3]}px;
		padding-left: ${space[3]}px;
	}
`;

const cardcontainer = css`
	display: flex;
	padding: ${space[9]}px 0;
`;

export default function StudentHeader({ geoId }: { geoId: GeoId }) {
	const cardContent = getProductContents(geoId);
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
					cardContent={cardContent}
				/>
			</div>
		</Container>
	);
}
