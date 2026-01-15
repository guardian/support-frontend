import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import AnchorButton from 'components/button/anchorButton';
import Content from 'components/content/content';
import { List } from 'components/list/list';
import { LargeParagraph, Title } from 'components/text/text';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import { DigitalPack, Paper } from 'helpers/productPrice/subscriptions';
import { routes } from 'helpers/urls/routes';
import { formatUserDate } from 'helpers/utilities/dateConversions';

const landingPageForProduct = (props: PromotionTerms) => {
	switch (props.product) {
		case DigitalPack:
			return routes.digitalSubscriptionLanding;

		case Paper:
			return routes.paperSubscriptionLanding;

		default:
			return props.isGift
				? routes.guardianWeeklySubscriptionLandingGift
				: routes.guardianWeeklySubscriptionLanding;
	}
};

const buttonStyle = css`
	margin: ${space[6]}px 0 ${space[4]}px;
`;

export default function PromoDetails(props: PromotionTerms): JSX.Element {
	const validUntil = props.expires ? (
		<LargeParagraph>
			<strong>Valid until:</strong> {formatUserDate(props.expires)}
		</LargeParagraph>
	) : null;
	return (
		<Content>
			<Title>Promotional code: {props.promoCode}</Title>
			<LargeParagraph>
				<strong>Promotion details:</strong> {props.description}
			</LargeParagraph>
			{validUntil}
			<LargeParagraph>
				<strong>Applies to products:</strong>
				<List
					cssOverrides={css`
						font-size: inherit;
						margin: 0 !important;
					`}
					items={props.productRatePlans.map((content) => ({
						content,
					}))}
				/>
			</LargeParagraph>
			<div css={buttonStyle}>
				<AnchorButton
					link={`${landingPageForProduct(props)}?promoCode=${props.promoCode}`}
					ctaButtonText="Get this offer"
					theme={themeButtonReaderRevenueBrand}
				/>
			</div>
		</Content>
	);
}
