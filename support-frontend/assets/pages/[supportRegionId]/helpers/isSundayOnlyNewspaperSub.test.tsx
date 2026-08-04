import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { isSundayOnlyNewspaperSub } from './isSundayOnlyNewspaperSub';

describe('isSundayOnlyNewspaperSub', () => {
	it.each`
		productKey            | ratePlanKey   | expected
		${'HomeDelivery'}     | ${'Sunday'}   | ${true}
		${'HomeDelivery'}     | ${'Everyday'} | ${false}
		${'SubscriptionCard'} | ${'Sunday'}   | ${true}
		${'SupporterPlus'}    | ${'Sunday'}   | ${false}
	`(
		`should return $expected for productKey $productKey and ratePlanKey $ratePlanKey`,
		({ productKey, ratePlanKey, expected }) => {
			const isSundayOnlyNewspaperSubscription = isSundayOnlyNewspaperSub(
				productKey as ActiveProductKey,
				ratePlanKey as ActiveRatePlanKey,
			);

			expect(isSundayOnlyNewspaperSubscription).toEqual(expected);
		},
	);
});
