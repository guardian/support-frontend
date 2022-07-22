// ----- Imports ----- //

import { pollUntilPromise } from 'helpers/async/promise';

// ----- Tests ----- //

describe('promise', () => {
	describe('polling', () => {
		it('return a successful action', async () => {
			expect.assertions(1);

			let n = 0;
			await pollUntilPromise(
				2,
				50,
				() => {
					n += 1;
					return Promise.resolve(n);
				},
				() => n <= 1,
			);

			expect(n).toEqual(2);
		});
	});
});
