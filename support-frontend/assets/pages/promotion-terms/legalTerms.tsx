import Content from 'components/content/content';
import Divider from 'components/content/Divider';
import { Title } from 'components/text/text';
import DigitalPackTerms from 'pages/promotion-terms/DigitalPackTerms';
import PaperTerms from 'pages/promotion-terms/PaperTerms';
import WeeklyTerms from 'pages/promotion-terms/weeklyTerms';
import { getProductKey } from './promotionSelectors';
import type { PromotionTermsPropTypes } from './promotionTermsPropTypes';

const getTermsForProduct = (props: PromotionTermsPropTypes) => {
	const { promotion } = props;
	const productKey = getProductKey(promotion.appliesTo.catalogRatePlans);
	const starts = new Date(promotion.startTimestamp);
	const expires = promotion.endTimestamp
		? new Date(promotion.endTimestamp)
		: null;
	const promoCode = promotion.promoCode;

	switch (productKey) {
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return <WeeklyTerms />;

		case 'DigitalSubscription':
		case undefined:
			return (
				<DigitalPackTerms
					starts={starts}
					expires={expires}
					promoCode={promoCode}
					countryGroupId={props.countryGroupId}
				/>
			);

		default:
			return (
				<PaperTerms starts={starts} expires={expires} promoCode={promoCode} />
			);
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
