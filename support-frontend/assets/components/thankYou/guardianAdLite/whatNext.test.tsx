import { render } from '@testing-library/react';
import type { ObserverPaperType } from 'pages/[countryGroupId]/components/thankYouComponent';
import { WhatNext } from './whatNext';

describe('Summary Ts&Cs Snapshot comparison', () => {
	const whatNextItems = [
		[true, 'ObserverPaper'],
		[false, 'ObserverSubscriptionCard'],
	];
	it.each(whatNextItems)(
		`whatNext renders correctly (signedIn=%s, %s list)`,
		(signIn, observerPaperType) => {
			const { container } = render(
				<WhatNext
					amount={'12'}
					startDate={'Friday, March 28, 2025'}
					isSignedIn={signIn as boolean}
					isObserver={observerPaperType as ObserverPaperType}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
