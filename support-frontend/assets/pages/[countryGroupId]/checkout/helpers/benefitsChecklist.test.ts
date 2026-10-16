import {
	allDigitalPlusBenefits,
	baseDigitalPlusBenefits,
	primaryDigitalPlusBenefit,
} from 'helpers/abTests/landingPageAbTests';
import { reduceBenefitsToAbTestVariant } from './benefitsChecklist';

describe('benefitsChecklist', () => {
	describe('reduceBenefitsToAbTestVariant', () => {
		it('Found test, replaced variants with control', () => {
			const result = reduceBenefitsToAbTestVariant(
				allDigitalPlusBenefits,
				'multipleAccounts',
				'control',
			);

			const primaryDigitalPlusBenefitControl = {
				...primaryDigitalPlusBenefit,
				specificToAbTest: [
					{ name: 'multipleAccounts', variants: ['control'], display: true },
				],
			};

			expect(result).toEqual([
				primaryDigitalPlusBenefitControl,
				...baseDigitalPlusBenefits,
			]);
		});
		it('Not found test, variant remains unchanged', () => {
			const result = reduceBenefitsToAbTestVariant(
				allDigitalPlusBenefits,
				'invalid-test',
				'control',
			);
			expect(result).toEqual(allDigitalPlusBenefits);
		});
	});
});
