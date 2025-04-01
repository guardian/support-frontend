import { render } from '@testing-library/react';
import { WhatNext } from './whatNext';
import type { ListStyle } from './whatNext';

describe('Summary Ts&Cs Snapshot comparison', () => {
	const whatNextItems = [
		[true, 'bullet'],
		[false, 'bullet'],
		[true, 'order'],
		[false, 'order'],
	];
	it.each(whatNextItems)(
		`whatNext renders correctly (signedIn=%s, %s list)`,
		(signIn, listStyle) => {
			const { container } = render(
				<WhatNext
					amount={'12'}
					startDate={'Friday, March 28, 2025'}
					isSignedIn={signIn as boolean}
					listStyle={listStyle as ListStyle}
				/>,
			);
			expect(container).toMatchSnapshot();
		},
	);
});
