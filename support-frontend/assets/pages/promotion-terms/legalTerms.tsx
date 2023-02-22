import Content, { Divider } from 'components/content/content';
import { Title } from 'components/text/text';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import PaperTerms from 'pages/promotion-terms/PaperTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';

const getTermsForProduct = (props: PromotionTermsPropTypes) => {
	switch (props.promotionTerms.product) {
		case GuardianWeekly:
			return <WeeklyTerms {...props} />;

		default:
			return <PaperTerms {...props.promotionTerms} />;
	}
};

export default function LegalTerms(
	props: PromotionTermsPropTypes,
): JSX.Element {
	return (
		<Content>
			<Divider />
			<Title size={1}>Promotion terms and conditions</Title>
			{getTermsForProduct(props)}
		</Content>
	);
}
