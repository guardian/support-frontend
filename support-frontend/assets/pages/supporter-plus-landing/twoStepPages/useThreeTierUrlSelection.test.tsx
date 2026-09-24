import { renderHook } from '@testing-library/react';
import { useThreeTierUrlSelection } from './useThreeTierUrlSelection';

const setUrlSearch = (search: string) => {
	Object.defineProperty(window, 'location', {
		value: { search },
		writable: true,
	});
};

describe('useThreeTierUrlSelection', () => {
	it('returns undefined/defaults when no query params are present', () => {
		setUrlSearch('');

		const { result } = renderHook(() => useThreeTierUrlSelection());

		expect(result.current).toEqual({
			product: undefined,
			ratePlan: undefined,
			selectedAmount: null,
			forceWeeklyPricing: false,
		});
	});

	it('lower-cases the product param', () => {
		setUrlSearch('?product=SupporterPlus');

		const { result } = renderHook(() => useThreeTierUrlSelection());

		expect(result.current.product).toBe('supporterplus');
	});

	it('trims and lower-cases the ratePlan param', () => {
		setUrlSearch('?ratePlan=%20Annual%20');

		const { result } = renderHook(() => useThreeTierUrlSelection());

		expect(result.current.ratePlan).toBe('annual');
	});

	it('returns the raw selected-amount param', () => {
		setUrlSearch('?selected-amount=12');

		const { result } = renderHook(() => useThreeTierUrlSelection());

		expect(result.current.selectedAmount).toBe('12');
	});

	it('only treats force-weekly=true as truthy', () => {
		setUrlSearch('?force-weekly=true');
		expect(
			renderHook(() => useThreeTierUrlSelection()).result.current
				.forceWeeklyPricing,
		).toBe(true);

		setUrlSearch('?force-weekly=false');
		expect(
			renderHook(() => useThreeTierUrlSelection()).result.current
				.forceWeeklyPricing,
		).toBe(false);

		setUrlSearch('');
		expect(
			renderHook(() => useThreeTierUrlSelection()).result.current
				.forceWeeklyPricing,
		).toBe(false);
	});
});
