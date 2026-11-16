import { addSourceContextToPath, buildBackButtonPath } from '../backButton';
import { clearSourceContext, setSourceContext } from '../sessionStorage';

describe('buildBackButtonPath', () => {
	it('returns the overridden path when a valid override is provided', () => {
		const result = buildBackButtonPath('/contribute', 'subscribe');

		expect(result).toBe('/subscribe');
	});

	it('returns the default path when no override is provided', () => {
		const result = buildBackButtonPath('/contribute', null);

		expect(result).toBe('/contribute');
	});

	it('returns the default path when an invalid override is provided', () => {
		const result = buildBackButtonPath('/contribute', 'invalidOverride');

		expect(result).toBe('/contribute');
	});
});

describe('addSourceContextToPath', () => {
	beforeEach(() => {
		clearSourceContext();
	});

	it('leaves the path unchanged when nothing was saved', () => {
		expect(addSourceContextToPath('/us/contribute')).toBe('/us/contribute');
	});

	it('adds the saved source and returnUrl', () => {
		setSourceContext({
			source: 'puzzles',
			returnUrl: 'https://www.theguardian.com/puzzles-and-games?a=b',
		});

		expect(addSourceContextToPath('/us/contribute')).toBe(
			'/us/contribute?source=puzzles&returnUrl=https%3A%2F%2Fwww.theguardian.com%2Fpuzzles-and-games%3Fa%3Db',
		);
	});

	it('adds only the source when there is no returnUrl', () => {
		setSourceContext({ source: 'puzzles' });

		expect(addSourceContextToPath('/us/contribute')).toBe(
			'/us/contribute?source=puzzles',
		);
	});
});
