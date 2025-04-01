import { render } from '@testing-library/react';
import { WhatNext } from './whatNext';

describe('Summary Ts&Cs Snapshot comparison', () => {
	const signIn: Array<boolean | undefined> = [true, false];
	it.each(signIn)(`summaryTs&Cs render product %s correctly`, (signIn) => {
		const { container } = render(
			<WhatNext
				amount={'12'}
				startDate={'Friday, March 28, 2025'}
				isSignedIn={signIn}
			/>,
		);
		expect(container).toMatchSnapshot();
	});
});
