import { describe, expect, it } from 'vitest';
import { baseAcquisitionProduct } from './fixtures';
import { AcquisitionProductEventSchema } from './schemas';

describe('AcquisitionProductEventSchema', () => {
	it('accepts Patrons acquisitions', () => {
		const result = AcquisitionProductEventSchema.safeParse({
			detail: { ...baseAcquisitionProduct, product: 'PATRON' },
		});

		expect(result.success).toBe(true);
	});
});
