import Content, { Divider } from 'components/content/content';
import { Title } from 'components/text/text';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import DigitalPackTerms from 'pages/promotion-terms/DigitalPackTerms';
import PaperTerms from 'pages/promotion-terms/PaperTerms';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';

const getTermsForProduct = (props: PromotionTermsPropTypes) => {
	switch (props.promotionTerms.product) {
		case GuardianWeekly:
			return <WeeklyTerms />;

		case DigitalPack:
			return (
				<DigitalPackTerms
					{...props.promotionTerms}
					countryGroupId={props.countryGroupId}
				/>
			);

		default:
			return <PaperTerms {...props.promotionTerms} />;
	}
};

export default function LegalTerms(props: PromotionTermsPropTypes) {
	return (
		<Content>
			<Divider />
			<Title size={1}>Promotion terms and conditions</Title>
			{getTermsForProduct(props)}
		</Content>
	);
}
