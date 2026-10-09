import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { useThreeTierUrlSelection } from './useThreeTierUrlSelection';

jest.mock('helpers/productCatalog', () => ({
	productCatalog: {
		Contribution: {
			ratePlans: {
				Monthly: {},
				Annual: {},
			},
		},
		SupporterPlus: {
			ratePlans: {
				Monthly: {},
				Annual: {},
				OneYearStudent: {},
			},
		},
	},
}));

function renderWithSearch(search: string) {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<MemoryRouter initialEntries={[`/${search}`]}>{children}</MemoryRouter>
	);
	return renderHook(() => useThreeTierUrlSelection(), { wrapper }).result
		.current;
}

describe('useThreeTierUrlSelection', () => {
	it('returns undefined/defaults when no query params are present', () => {
		expect(renderWithSearch('')).toEqual({
			productKey: undefined,
			ratePlanKey: undefined,
			selectedAmount: null,
			forceWeeklyPricing: false,
		});
	});

	it('resolves the product param case-insensitively to its canonical ProductKey', () => {
		expect(renderWithSearch('?product=supporterplus').productKey).toBe(
			'SupporterPlus',
		);
	});

	it('returns undefined for an unrecognised product param', () => {
		expect(
			renderWithSearch('?product=not-a-real-product').productKey,
		).toBeUndefined();
	});

	it('trims and resolves the ratePlan param case-insensitively, validated against the given product', () => {
		expect(
			renderWithSearch('?product=SupporterPlus&ratePlan=%20oneyearstudent%20')
				.ratePlanKey,
		).toBe('OneYearStudent');
	});

	it('defaults ratePlan validation to Contribution when no product param is given', () => {
		expect(renderWithSearch('?ratePlan=annual').ratePlanKey).toBe('Annual');
	});

	it('rejects a ratePlan that is not valid for the given product', () => {
		expect(
			renderWithSearch('?product=Contribution&ratePlan=OneYearStudent')
				.ratePlanKey,
		).toBeUndefined();
	});

	it('returns undefined for an unrecognised ratePlan param', () => {
		expect(
			renderWithSearch('?ratePlan=not-a-real-rate-plan').ratePlanKey,
		).toBeUndefined();
	});

	it('returns the raw selected-amount param', () => {
		expect(renderWithSearch('?selected-amount=12').selectedAmount).toBe('12');
	});

	it('only treats force-weekly=true as truthy', () => {
		expect(renderWithSearch('?force-weekly=true').forceWeeklyPricing).toBe(
			true,
		);
		expect(renderWithSearch('?force-weekly=false').forceWeeklyPricing).toBe(
			false,
		);
		expect(renderWithSearch('').forceWeeklyPricing).toBe(false);
	});
});
