import Content from 'components/content/content';
import Divider from 'components/content/Divider';
import { Title } from 'components/text/text';
import {
	DigitalPack,
	GuardianWeekly,
} from 'helpers/productPrice/subscriptions';
import DigitalPackTerms from 'pages/promotion-terms/DigitalPackTerms';
import PaperTerms from 'pages/promotion-terms/PaperTerms';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';
import type { PromotionTermsPropTypes } from './promotionTermsPropTypes';

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
			<Title>Promotion terms and conditions</Title>
			{getTermsForProduct(props)}
		</Content>
	);
}
