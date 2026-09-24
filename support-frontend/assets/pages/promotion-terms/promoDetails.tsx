import { css } from '@emotion/react';
import { space, until } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import Content from 'components/content/content';
import { List } from 'components/list/list';
import { LargeParagraph, Title } from 'components/text/text';
import { routes } from 'helpers/urls/routes';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import {
	getProductKey,
	getProductRatePlanDescriptions,
	isGiftPromotion,
} from './promotionSelectors';

const landingPageForProduct = (promotion: PromoWithCatalogInformation) => {
	const productKey = getProductKey(promotion.appliesTo.catalogRatePlans);
	switch (productKey) {
		case 'DigitalSubscription':
			return routes.digitalSubscriptionLanding;

		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return isGiftPromotion(promotion.appliesTo.catalogRatePlans)
				? routes.guardianWeeklySubscriptionLandingGift
				: routes.guardianWeeklySubscriptionLanding;

		default:
			return routes.paperSubscriptionLanding;
	}
};

const buttonStyle = css`
	margin: ${space[6]}px 0 ${space[4]}px;

	${until.tablet} {
		> a {
			width: 100%;
		}
	}
`;

type PropTypes = {
	promotion?: PromoWithCatalogInformation;
};

export default function PromoDetails({ promotion }: PropTypes): JSX.Element {
	const expires = promotion?.endTimestamp
		? new Date(promotion.endTimestamp)
		: null;
	const validUntil = expires ? (
		<LargeParagraph>
			<strong>Valid until:</strong> {formatUserDate(expires)}
		</LargeParagraph>
	) : null;
	const productRatePlans = promotion
		? getProductRatePlanDescriptions(promotion.appliesTo.catalogRatePlans)
		: [];

	return (
		<Content>
			<Title>Promotional code: {promotion?.promoCode ?? ''}</Title>
			<LargeParagraph>
				<strong>Promotion details:</strong> {promotion?.description ?? ''}
			</LargeParagraph>
			{validUntil}
			<LargeParagraph>
				<strong>Applies to products:</strong>
				<List
					cssOverrides={css`
						font-size: inherit;
						margin: 0 !important;
					`}
					items={productRatePlans.map((content) => ({
						content,
					}))}
				/>
			</LargeParagraph>
			<div css={buttonStyle}>
				<LinkButton
					href={
						promotion
							? `${landingPageForProduct(promotion)}?promoCode=${
									promotion.promoCode
							  }`
							: '#'
					}
					theme={themeButtonReaderRevenueBrand}
					icon={<SvgArrowRightStraight />}
					iconSide="right"
				>
					Get this offer
				</LinkButton>
			</div>
		</Content>
	);
}
