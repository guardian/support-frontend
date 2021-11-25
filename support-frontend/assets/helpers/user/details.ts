import type { $Keys } from 'utility-types';

export const titles: Record<string, string> = {
	Ms: 'Ms',
	Mr: 'Mr',
	Mrs: 'Mrs',
	Mx: 'Mx',
	Miss: 'Miss',
	Dr: 'Dr',
	Prof: 'Prof',
	Rev: 'Rev',
};
export type Title = $Keys<typeof titles>;
