import { render } from '@testing-library/react';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import { WhatNext } from './whatNext';

describe('Summary Ts&Cs Snapshot comparison', () => {
	const whatNextItems = [
		[true, ObserverPrint.Paper],
		[false, ObserverPrint.SubscriptionCard],
	];
	it.each(whatNextItems)(
		`whatNext renders correctly (signedIn=%s, %s list)`,
		(signIn, observerPaperType) => {
			const { container } = render(
				<WhatNext
					amount={'12'}
					startDate={'Friday, March 28, 2025'}
					isSignedIn={signIn as boolean}
					observerPrint={observerPaperType as ObserverPrint}
					isGuardianWeekly={false}
					isGuardianPrint={false}
					isSubscriptionCard={
						observerPaperType === ObserverPrint.SubscriptionCard
					}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
